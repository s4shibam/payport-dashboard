import type { TCountryCountChartProps } from '@/components/dashboard/country-count-chart'
import type { TPaymentMethodChartProps } from '@/components/dashboard/payment-method-chart'
import { env } from '@/lib/env'
import type { TEventMode, TPaymentEvent } from '@/types'
import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_RECENT = 50
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 2000

export type TStreamStatus = 'connecting' | 'live' | 'disconnected'

export type TDashboardStats = {
  recentEvents: TPaymentEvent[]
  totalVolume: number
  totalTransactions: number
  successRate: number
  avgTxnValue: number
  largestSuccessTxn: TPaymentEvent | null
  paymentMethodStats: TPaymentMethodChartProps['data']
  countryStats: TCountryCountChartProps['data']
  status: TStreamStatus
  lastUpdatedAt: Date | null
  mode: TEventMode
}

const INITIAL_STATS: TDashboardStats = {
  recentEvents: [],
  totalVolume: 0,
  totalTransactions: 0,
  successRate: 0,
  avgTxnValue: 0,
  largestSuccessTxn: null,
  paymentMethodStats: [],
  countryStats: [],
  status: 'connecting',
  lastUpdatedAt: null,
  mode: 'normal',
}

export const usePaymentStream = () => {
  const totalVolumeRef = useRef(0)
  const successCountRef = useRef(0)
  const totalCountRef = useRef(0)
  const methodCountRef = useRef<Record<string, number>>({})
  const countryMapRef = useRef<
    Record<string, { success: number; failed: number }>
  >({})
  const recentEventsRef = useRef<TPaymentEvent[]>([])
  const largestSuccessTxnRef = useRef<TPaymentEvent | null>(null)
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [stats, setStats] = useState<TDashboardStats>(INITIAL_STATS)

  useEffect(() => {
    if (!env.apiBaseUrl || !env.emailId) return

    let cancelled = false
    let retryCount = 0
    let es: EventSource | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const connect = () => {
      if (cancelled) return

      try {
        es = new EventSource(`${env.apiBaseUrl}/events?email=${env.emailId}`)
      } catch (err) {
        console.error('[usePaymentStream] Failed to create EventSource:', err)
        setStats((prev) => ({ ...prev, status: 'disconnected' }))
        return
      }

      es.onopen = () => {
        retryCount = 0
        setStats((prev) => ({ ...prev, status: 'live' }))
      }

      es.onmessage = (event) => {
        let data: Record<string, unknown>
        try {
          data = JSON.parse(event.data)
        } catch (err) {
          console.error('[usePaymentStream] Failed to parse SSE message:', err)
          return
        }

        if (data.type === 'connected' || data.type === 'mode_changed') {
          setStats((prev) => ({ ...prev, mode: data.mode as TEventMode }))
          return
        }

        if (data.type) return

        const payment = data as TPaymentEvent

        totalCountRef.current += 1
        totalVolumeRef.current += payment.amount

        if (payment.status === 'success') {
          successCountRef.current += 1

          if (
            largestSuccessTxnRef.current === null ||
            payment.amount > largestSuccessTxnRef.current.amount
          ) {
            largestSuccessTxnRef.current = payment
          }
        }

        methodCountRef.current[payment.paymentMethod] =
          (methodCountRef.current[payment.paymentMethod] ?? 0) + 1

        const prev = countryMapRef.current[payment.country] ?? {
          success: 0,
          failed: 0,
        }
        countryMapRef.current[payment.country] = {
          success: prev.success + (payment.status === 'success' ? 1 : 0),
          failed: prev.failed + (payment.status === 'failed' ? 1 : 0),
        }

        recentEventsRef.current.unshift(payment)
        if (recentEventsRef.current.length > MAX_RECENT) {
          recentEventsRef.current.length = MAX_RECENT
        }

        if (!throttleTimerRef.current) {
          throttleTimerRef.current = setTimeout(() => {
            throttleTimerRef.current = null
            const total = totalCountRef.current
            const volume = totalVolumeRef.current
            setStats((prev) => ({
              ...prev,
              recentEvents: [...recentEventsRef.current],
              totalVolume: volume,
              totalTransactions: total,
              successRate:
                total > 0 ? (successCountRef.current / total) * 100 : 0,
              avgTxnValue: total > 0 ? volume / total : 0,
              largestSuccessTxn: largestSuccessTxnRef.current,
              paymentMethodStats: Object.entries(methodCountRef.current).map(
                ([method, count]) => ({
                  method: method as TPaymentEvent['paymentMethod'],
                  count,
                })
              ),
              countryStats: Object.entries(countryMapRef.current).map(
                ([country, s]) => ({ country, ...s })
              ),
              lastUpdatedAt: new Date(),
            }))
          }, 1000)
        }
      }

      es.onerror = () => {
        console.error('[usePaymentStream] SSE connection error')

        es?.close()
        if (cancelled) return

        if (retryCount < MAX_RETRIES) {
          retryCount++
          setStats((prev) => ({ ...prev, status: 'connecting' }))
          timeoutId = setTimeout(connect, RETRY_DELAY_MS)
        } else {
          setStats((prev) => ({ ...prev, status: 'disconnected' }))
        }
      }
    }

    connect()

    return () => {
      cancelled = true
      es?.close()
      if (timeoutId) clearTimeout(timeoutId)
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current)
    }
  }, [])

  const setMode = useCallback(async (newMode: TEventMode) => {
    if (!env.apiBaseUrl || !env.emailId) return

    try {
      const res = await fetch(`${env.apiBaseUrl}/test/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: env.emailId, mode: newMode }),
      })
      if (res.ok) {
        setStats((prev) => ({ ...prev, mode: newMode }))
      }
    } catch (err) {
      console.error('[usePaymentStream] Failed to set mode:', err)
    }
  }, [])

  return { ...stats, setMode }
}
