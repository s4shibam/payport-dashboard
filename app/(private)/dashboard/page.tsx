'use client'

import {
  CountryCountChart,
  TCountryCountChartProps,
} from '@/components/dashboard/country-count-chart'
import { MetricCard } from '@/components/dashboard/metric-card'
import { ModeSelector } from '@/components/dashboard/mode-selector'
import {
  PaymentMethodChart,
  TPaymentMethodChartProps,
} from '@/components/dashboard/payment-method-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { formatDateTime } from '@/lib/utils'
import { TEventMode, TPaymentEvent } from '@/types'
import { ArrowUpDown, CheckCircle2, Coins, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const DUMMY_TOTAL_VOLUME = '1000'
const DUMMY_TOTAL_TRANSACTIONS = '1000'
const DUMMY_SUCCESS_RATE = '90%'
const DUMMY_AVG_TXN_VALUE = '100'

const DUMMY_PAYMENT_EVENTS: TPaymentEvent[] = [
  {
    eventId: '1',
    timestamp: '2026-06-24T00:00:00Z',
    country: 'US',
    currency: 'USD',
    amount: 400,
    paymentMethod: 'APPLE_PAY',
    source: 'web',
    status: 'failed',
  },
  {
    eventId: '2',
    timestamp: '2026-06-24T00:00:00Z',
    country: 'US',
    currency: 'USD',
    amount: 235,
    paymentMethod: 'CARD_INSTALLMENT',
    source: 'web',
    status: 'success',
  },
  {
    eventId: '3',
    timestamp: '2026-06-24T00:00:00Z',
    country: 'GB',
    currency: 'GBP',
    amount: 89,
    paymentMethod: 'CARD',
    source: 'web',
    status: 'success',
  },
]

const DUMMY_PAYMENT_METHOD_STATS: TPaymentMethodChartProps['data'] = [
  {
    method: 'CARD',
    count: 140,
  },
  {
    method: 'APPLE_PAY',
    count: 120,
  },
  {
    method: 'CARD_INSTALLMENT',
    count: 80,
  },
]

const DUMMY_COUNTRY_STATS: TCountryCountChartProps['data'] = [
  {
    country: 'US',
    success: 10,
    failed: 0,
  },
  {
    country: 'GB',
    success: 45,
    failed: 20,
  },
  {
    country: 'CA',
    success: 35,
    failed: 65,
  },
]

const DashboardPage = () => {
  const [mode, setMode] = useState<TEventMode>('normal')
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastUpdatedAt(new Date())
    const interval = setInterval(() => {
      setLastUpdatedAt(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last updated:{' '}
            <span className="font-mono">
              {lastUpdatedAt ? formatDateTime(lastUpdatedAt) : '—'}
            </span>
          </p>
        </div>
        <ModeSelector value={mode} onChange={setMode} />
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          title="Total Volume"
          value={DUMMY_TOTAL_VOLUME}
          icon={Coins}
          accentClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <MetricCard
          title="Transactions"
          value={DUMMY_TOTAL_TRANSACTIONS}
          icon={ArrowUpDown}
          accentClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        />
        <MetricCard
          title="Success Rate"
          value={DUMMY_SUCCESS_RATE}
          icon={CheckCircle2}
          accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          title="Avg. Txn Value"
          value={DUMMY_AVG_TXN_VALUE}
          icon={TrendingUp}
          accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <RecentTransactions events={DUMMY_PAYMENT_EVENTS} />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <PaymentMethodChart data={DUMMY_PAYMENT_METHOD_STATS} />
          <CountryCountChart data={DUMMY_COUNTRY_STATS} />
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
