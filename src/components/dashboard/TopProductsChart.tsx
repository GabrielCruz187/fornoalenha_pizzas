import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useChartPalette } from '../../lib/chartColors'

interface DataPoint {
  name: string
  quantity: number
}

export function TopProductsChart({ data }: { data: DataPoint[] }) {
  const palette = useChartPalette()

  if (data.length === 0) {
    return <p className="py-8 text-center text-xs text-muted">Nenhum item vendido no período selecionado.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 4 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={170} tickLine={false} axisLine={false} tick={palette.axisTick} />
        <Tooltip
          cursor={{ fill: palette.cursorFill }}
          contentStyle={palette.tooltipStyle}
          formatter={(value) => [`${Number(value)} unid.`, '']}
          labelFormatter={(label) => label}
        />
        <Bar dataKey="quantity" fill={palette.sequentialHue} radius={[0, 4, 4, 0]} maxBarSize={18}>
          <LabelList dataKey="quantity" position="right" style={palette.labelStyle} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
