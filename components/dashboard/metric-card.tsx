import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { Info } from 'lucide-react'
import { memo } from 'react'

type TMetricCardProps = {
  title: string
  value: string
  icon: LucideIcon
  accentClass?: string
  info?: string
}

const MetricCardComponent = ({
  title,
  value,
  icon: Icon,
  accentClass = 'bg-primary/8 text-primary',
  info,
}: TMetricCardProps) => {
  return (
    <Card className="relative overflow-hidden border-border/60 shadow-none py-0">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                {title}
              </p>
              {info && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="shrink-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                        <Info className="size-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-60">
                      {info}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-lg md:text-xl font-semibold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
          </div>
          <div
            className={cn(
              'flex size-7 md:size-9 shrink-0 items-center justify-center rounded-lg',
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

export const MetricCard = memo(MetricCardComponent)
