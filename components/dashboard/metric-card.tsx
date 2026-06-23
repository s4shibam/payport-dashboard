import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type TMetricCardProps = {
  title: string
  value: string
  icon: LucideIcon
  accentClass?: string
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  accentClass = 'bg-primary/8 text-primary',
}: TMetricCardProps) => {
  return (
    <Card className="relative overflow-hidden border-border/60 shadow-none py-0">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
              {title}
            </p>
            <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
          </div>
          <div
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-lg',
              accentClass
            )}
          >
            <Icon className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
