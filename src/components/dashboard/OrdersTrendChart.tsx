import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useChartPalette } from '../../lib/chartColors'

interface DataPoint {
  label: string
  count: number
}

export function OrdersTrendChart({ data }: { data: DataPoint[] }) {
  const palette = useChartPalette()

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={palette.axisTickSmall}
          interval="preserveStartEnd"
        />
        <YAxis tickLine={false} axisLine={false} tick={palette.axisTickSmall} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: palette.cursorFill }}
          contentStyle={palette.tooltipStyle}
          formatter={(value) => {
            const n = Number(value)
            return [`${n} pedido${n === 1 ? '' : 's'}`, '']
          }}
        />
        <Bar dataKey="count" fill={palette.sequentialHue} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}
