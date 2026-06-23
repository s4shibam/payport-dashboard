import type { TCurrencyCode, TPaymentMethod, TSource } from '@/types'

export const EVENT_MODES = [
  'normal',
  'high_traffic',
  'country_focus',
  'payment_spike',
  'chaos',
] as const

export const PAYMENT_METHODS = [
  'CARD',
  'APPLE_PAY',
  'GOOGLE_PAY',
  'KLARNA',
  'AFTERPAY',
  'PAYPAL',
  'CARD_INSTALLMENT',
] as const

export const PAYMENT_METHOD_MAP: Record<TPaymentMethod, string> = {
  CARD: 'Card',
  APPLE_PAY: 'Apple Pay',
  GOOGLE_PAY: 'Google Pay',
  KLARNA: 'Klarna',
  AFTERPAY: 'Afterpay',
  PAYPAL: 'PayPal',
  CARD_INSTALLMENT: 'Card Installment',
}

export const CURRENCY_CODES = [
  'USD',
  'GBP',
  'CAD',
  'AUD',
  'AED',
  'EUR',
  'INR',
] as const

export const CURRENCY_TO_COUNTRY_MAP: Record<TCurrencyCode, string> = {
  USD: 'US',
  GBP: 'GB',
  CAD: 'Canada',
  AUD: 'Australia',
  AED: 'UAE',
  EUR: 'Germany',
  INR: 'India',
}

export const SOURCES = ['web', 'mobile', 'api'] as const

export const SOURCE_MAP: Record<TSource, string> = {
  web: 'Web',
  mobile: 'Mobile',
  api: 'API',
}

export const STATUSES = ['success', 'failed'] as const
