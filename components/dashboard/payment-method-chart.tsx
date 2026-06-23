'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PAYMENT_METHOD_MAP } from '@/lib/constants'
import type { TPaymentMethod } from '@/types'
import { ChartColumnBig } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const BAR_COLORS = [
  'hsl(220 80% 55%)',
  'hsl(20 90% 58%)',
  'hsl(140 65% 48%)',
  'hsl(0 70% 62%)',
  'hsl(270 65% 58%)',
  'hsl(45 92% 60%)',
  'hsl(320 60% 60%)',
]

export type TPaymentMethodChartProps = {
  data: {
    method: TPaymentMethod
    count: number
  }[]
}

export const PaymentMethodChart = ({ data }: TPaymentMethodChartProps) => {
  const chartData = data.map((d, i) => ({
    ...d,
    label: PAYMENT_METHOD_MAP[d.method as TPaymentMethod] ?? d.method,
    shortLabel: PAYMENT_METHOD_MAP[d.method as TPaymentMethod] ?? d.method,
    fill: BAR_COLORS[i % BAR_COLORS.length],
  }))

  return (
    <Card className="border-border/60 shadow-none h-full flex flex-col py-0">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">
          Payment Methods
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Transaction count by method
        </p>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex-1">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 h-46 text-muted-foreground/50">
            <ChartColumnBig className="size-8 stroke-[1.5]" />
            <p className="text-xs">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={184}>
            <BarChart
              data={chartData}
              barSize={32}
              margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="shortLabel"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'rgba(128,128,128,0.4)' }}
                tickLine={{ stroke: 'rgba(128,128,128,0.4)' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'rgba(128,128,128,0.4)' }}
                tickLine={{ stroke: 'rgba(128,128,128,0.4)' }}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

type TCustomTooltipProps = {
  active?: boolean
  payload?: Array<{
    value: number
    payload: TPaymentMethodChartProps['data'][number]
  }>
  label?: string
}

const CustomTooltip = ({ active, payload }: TCustomTooltipProps) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl text-xs">
      <p className="font-medium mb-1">
        {PAYMENT_METHOD_MAP[d.method as TPaymentMethod] ?? d.method}
      </p>
      <p className="text-muted-foreground">{d.count} transactions</p>
    </div>
  )
}
