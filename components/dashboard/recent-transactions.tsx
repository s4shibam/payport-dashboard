import { PAYMENT_METHOD_MAP, SOURCE_MAP } from '@/lib/constants'
import { cn, formatAmount, formatTransactionDateTime } from '@/lib/utils'
import { TPaymentEvent } from '@/types'
import { ReceiptText } from 'lucide-react'
import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type TRecentTransactionsProps = {
  events: TPaymentEvent[]
}

const RecentTransactionsComponent = ({ events }: TRecentTransactionsProps) => {
  return (
    <Card className="border-border/60 shadow-none h-full flex flex-col py-0">
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">
          Recent Transactions
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Last {events.length} payments
        </p>
      </CardHeader>
      <CardContent className="pl-5 flex-1 flex flex-col gap-0 min-h-0">
        <div className="flex flex-col divide-y divide-border/50 overflow-y-auto h-130 pr-3 scrollbar-thin">
          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 m-auto text-muted-foreground/50">
              <ReceiptText className="size-8 stroke-[1.5]" />
              <p className="text-xs">No transactions found</p>
            </div>
          )}

          {events.map((event, i) => (
            <TransactionRow key={event.eventId} event={event} first={i === 0} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const RecentTransactions = memo(RecentTransactionsComponent)

type TTransactionRowProps = {
  event: TPaymentEvent
  first: boolean
}

const TransactionRowComponent = ({ event, first }: TTransactionRowProps) => {
  const isSuccess = event.status === 'success'

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 py-3',
        first && 'pt-0'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <span className="text-sm font-medium text-foreground truncate">
            {PAYMENT_METHOD_MAP[event.paymentMethod]}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-muted-foreground font-mono tracking-tight">
              {event.country}
            </span>
            <span className="text-xs text-muted-foreground/60">•</span>
            <span className="text-xs text-muted-foreground">
              {SOURCE_MAP[event.source]}
            </span>
            <span className="text-xs text-muted-foreground/60">•</span>
            <span className="text-xs text-muted-foreground">
              {formatTransactionDateTime(event.timestamp)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 gap-0.5">
        <span className="text-sm font-semibold font-mono text-foreground tabular-nums">
          {formatAmount(event.amount, event.currency)}
        </span>
        <span
          className={cn(
            'text-xs font-medium rounded-full px-1.5 py-0.5 capitalize',
            isSuccess
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-rose-500/10 text-rose-600'
          )}
        >
          {event.status}
        </span>
      </div>
    </div>
  )
}

const TransactionRow = memo(TransactionRowComponent)
