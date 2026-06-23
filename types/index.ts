import type {
  CURRENCY_CODES,
  EVENT_MODES,
  PAYMENT_METHODS,
  SOURCES,
  STATUSES,
} from '@/lib/constants'

export type TEventMode = (typeof EVENT_MODES)[number]

export type TPaymentMethod = (typeof PAYMENT_METHODS)[number]

export type TCurrencyCode = (typeof CURRENCY_CODES)[number]

export type TSource = (typeof SOURCES)[number]

export type TStatus = (typeof STATUSES)[number]

export type TPaymentEvent = {
  eventId: string
  timestamp: string
  country: string
  currency: TCurrencyCode
  amount: number
  paymentMethod: TPaymentMethod
  source: TSource
  status: TStatus
}
