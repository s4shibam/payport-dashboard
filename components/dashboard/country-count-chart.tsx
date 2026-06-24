'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartPie } from 'lucide-react'
import { memo, useMemo } from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export type TCountryCountChartProps = {
  data: { country: string; success: number; failed: number }[]
}

const COLORS = [
  'hsl(210 85% 60%)',
  'hsl(40 98% 58%)',
  'hsl(130 61% 48%)',
  'hsl(340 82% 60%)',
  'hsl(270 72% 60%)',
  'hsl(0 82% 60%)',
  'hsl(195 76% 66%)',
  'hsl(55 93% 60%)',
]

type TChartRow = {
  country: string
  count: number
  success: number
  failed: number
  fill: string
}

const CountryCountChartComponent = ({ data }: TCountryCountChartProps) => {
  const chartData: TChartRow[] = useMemo(
    () =>
      data
        .map((d) => ({ ...d, count: d.success + d.failed }))
        .sort((a, b) => b.count - a.count)
        .map((d, i) => ({
          country: d.country,
          count: d.count,
          success: d.success,
          failed: d.failed,
          fill: COLORS[i % COLORS.length],
        })),
    [data]
  )

  return (
    <Card className="border-border/60 shadow-none h-full flex flex-col py-0">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">
          Transactions by Country
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Top regions by transaction count
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 flex gap-2 items-center">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-50 text-muted-foreground/50">
            <ChartPie className="size-8 stroke-[1.5]" />
            <p className="text-xs">No data available</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="52%"
                  outerRadius="88%"
                  dataKey="count"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                  paddingAngle={3}
                  cornerRadius={5}
                />

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
              {chartData.map((d) => (
                <div
                  key={d.country}
                  className="flex items-center gap-2 min-w-0"
                >
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ background: d.fill }}
                  />
                  <span className="text-xs font-medium text-foreground shrink-0 w-16 truncate">
                    {d.country}
                  </span>
                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden min-w-0">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.count / chartData[0].count) * 100}%`,
                        background: d.fill,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export const CountryCountChart = memo(CountryCountChartComponent)

type TTooltipProps = {
  active?: boolean
  payload?: Array<{
    payload: {
      country: string
      count: number
      success: number
      failed: number
    }
  }>
}

const CustomTooltip = ({ active, payload }: TTooltipProps) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold mb-1">{d.country}</p>
      <p className="text-muted-foreground">
        Total: <span className="font-medium text-foreground">{d.count}</span>
      </p>
      <p className="text-emerald-600">Success: {d.success}</p>
      <p className="text-red-500">Failed: {d.failed}</p>
    </div>
  )
}
