'use client'

import { CountryCountChart } from '@/components/dashboard/country-count-chart'
import { MetricCard } from '@/components/dashboard/metric-card'
import { ModeSelector } from '@/components/dashboard/mode-selector'
import { PaymentMethodChart } from '@/components/dashboard/payment-method-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { Badge } from '@/components/ui/badge'
import { usePaymentStream } from '@/hooks/use-payment-stream'
import { formatAmount, formatCompactNumber, formatDateTime } from '@/lib/utils'
import {
  ArrowUpDown,
  CheckCircle2,
  Coins,
  RefreshCw,
  TrendingUp,
  Trophy,
} from 'lucide-react'

const DashboardPage = () => {
  const {
    recentEvents,
    totalVolume,
    totalTransactions,
    successRate,
    avgTxnValue,
    paymentMethodStats,
    countryStats,
    largestSuccessTxn,
    status,
    lastUpdatedAt,
    mode,
    setMode,
  } = usePaymentStream()

  const hasData = totalTransactions > 0

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>

          <div className="flex items-center mt-1 gap-1.5 flex-wrap">
            {status === 'connecting' && (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-600 border-amber-500/20"
              >
                Connecting...
              </Badge>
            )}

            {status === 'live' && (
              <>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                >
                  Live
                </Badge>

                <span className="text-xs text-muted-foreground">
                  Last Updated:{' '}
                  <span className="font-mono">
                    {lastUpdatedAt ? formatDateTime(lastUpdatedAt) : '—'}
                  </span>
                </span>
              </>
            )}

            {status === 'disconnected' && (
              <>
                <Badge
                  variant="outline"
                  className="bg-rose-500/10 text-rose-600 border-rose-500/20"
                >
                  Disconnected
                </Badge>

                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  <RefreshCw className="size-3" />
                  Reload
                </button>
              </>
            )}
          </div>
        </div>

        <ModeSelector value={mode} onChange={setMode} />
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard
          title="Total Volume"
          value={hasData ? formatCompactNumber(totalVolume) : '—'}
          icon={Coins}
          accentClass="bg-blue-500/10 text-blue-600"
          info="All payment amounts combined, including failed."
        />
        <MetricCard
          title="Transactions"
          value={hasData ? formatCompactNumber(totalTransactions) : '—'}
          icon={ArrowUpDown}
          accentClass="bg-violet-500/10 text-violet-600"
          info="All payment events, successful and failed."
        />
        <MetricCard
          title="Success Rate"
          value={hasData ? `${successRate.toFixed(1)}%` : '—'}
          icon={CheckCircle2}
          accentClass="bg-emerald-500/10 text-emerald-600"
          info="% of all events that succeeded."
        />
        <MetricCard
          title="Avg. Txn Value"
          value={hasData ? formatCompactNumber(avgTxnValue) : '—'}
          icon={TrendingUp}
          accentClass="bg-amber-500/10 text-amber-600"
          info="Total volume ÷ total transactions."
        />
        <MetricCard
          title="Largest Txn"
          value={
            largestSuccessTxn
              ? formatAmount(
                  largestSuccessTxn.amount,
                  largestSuccessTxn.currency
                )
              : '—'
          }
          icon={Trophy}
          accentClass="bg-rose-500/10 text-rose-600"
          info="Single biggest successful payment this session by volume."
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <RecentTransactions events={recentEvents} />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <PaymentMethodChart data={paymentMethodStats} />
          <CountryCountChart data={countryStats} />
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
