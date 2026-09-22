import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SEQUENTIAL_HUE, CHART_INK } from '../../lib/chartColors'

interface DataPoint {
  name: string
  quantity: number
}

export function TopProductsChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-xs text-muted">Nenhum item vendido no período selecionado.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={170}
          tickLine={false}
          axisLine={false}
          tick={{ fill: CHART_INK.secondary, fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            background: '#261f1a',
            border: '1px solid #382e25',
            borderRadius: 8,
            fontSize: 12,
            color: '#f5ecd9',
          }}
          formatter={(value) => [`${Number(value)} unid.`, '']}
          labelFormatter={(label) => label}
        />
        <Bar dataKey="quantity" fill={SEQUENTIAL_HUE} radius={[0, 4, 4, 0]} maxBarSize={18}>
          <LabelList dataKey="quantity" position="right" style={{ fill: '#d9cbb2', fontSize: 12, fontWeight: 500 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
