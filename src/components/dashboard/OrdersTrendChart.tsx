import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SEQUENTIAL_HUE, CHART_INK } from '../../lib/chartColors'

interface DataPoint {
  label: string
  count: number
}

export function OrdersTrendChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid vertical={false} stroke={CHART_INK.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: CHART_INK.secondary, fontSize: 11 }}
          interval="preserveStartEnd"
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: CHART_INK.secondary, fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            background: '#261f1a',
            border: '1px solid #382e25',
            borderRadius: 8,
            fontSize: 12,
            color: '#f5ecd9',
          }}
          formatter={(value) => {
            const n = Number(value)
            return [`${n} pedido${n === 1 ? '' : 's'}`, '']
          }}
        />
        <Bar dataKey="count" fill={SEQUENTIAL_HUE} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}
