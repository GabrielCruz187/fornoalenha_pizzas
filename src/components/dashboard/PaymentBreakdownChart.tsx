import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../../lib/format'
import { PAYMENT_COLORS, CHART_INK } from '../../lib/chartColors'
import type { PaymentMethod } from '../../types'

interface DataPoint {
  method: PaymentMethod
  label: string
  total: number
  count: number
}

export function PaymentBreakdownChart({ data }: { data: DataPoint[] }) {
  const hasData = data.some((d) => d.total > 0)

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
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
            formatter={(value, _name, item) => {
              const count = (item?.payload as DataPoint | undefined)?.count ?? 0
              return [`${formatCurrency(Number(value))} · ${count} pedido${count === 1 ? '' : 's'}`, '']
            }}
            labelFormatter={() => ''}
          />
          <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((entry) => (
              <Cell key={entry.method} fill={PAYMENT_COLORS[entry.method]} />
            ))}
            <LabelList
              dataKey="total"
              position="right"
              formatter={(v: unknown) => (Number(v) > 0 ? formatCurrency(Number(v)) : '')}
              style={{ fill: '#d9cbb2', fontSize: 12, fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {!hasData && <p className="text-center text-xs text-muted">Sem faturamento no período selecionado.</p>}
    </div>
  )
}
