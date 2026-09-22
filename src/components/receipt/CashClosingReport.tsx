import type { CSSProperties } from 'react'
import { formatCurrency } from '../../lib/format'
import type { CashClosingData } from '../../lib/dashboardStats'

export function CashClosingReport({ data }: { data: CashClosingData }) {
  return (
    <div style={{ padding: '4mm', color: '#000', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>FORNO A LENHA</h1>
        <p style={{ fontSize: 13, margin: '2px 0 0' }}>Fechamento de Caixa — {data.dateLabel}</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <tbody>
          <tr>
            <td style={cellLabel}>Pedidos válidos</td>
            <td style={cellValue}>{data.totalOrders}</td>
          </tr>
          <tr>
            <td style={cellLabel}>Pedidos cancelados</td>
            <td style={cellValue}>{data.cancelledOrders}</td>
          </tr>
          <tr>
            <td style={{ ...cellLabel, fontWeight: 700 }}>Faturamento total</td>
            <td style={{ ...cellValue, fontWeight: 700 }}>{formatCurrency(data.revenue)}</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Recebimentos por forma de pagamento</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerCell}>Forma de pagamento</th>
            <th style={{ ...headerCell, textAlign: 'center' }}>Qtd. pedidos</th>
            <th style={{ ...headerCell, textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.payments.map((p) => (
            <tr key={p.label}>
              <td style={bodyCell}>{p.label}</td>
              <td style={{ ...bodyCell, textAlign: 'center' }}>{p.count}</td>
              <td style={{ ...bodyCell, textAlign: 'right' }}>{formatCurrency(p.total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ ...bodyCell, fontWeight: 700, borderTop: '2px solid #000' }}>Total</td>
            <td style={{ ...bodyCell, fontWeight: 700, borderTop: '2px solid #000', textAlign: 'center' }}>
              {data.payments.reduce((s, p) => s + p.count, 0)}
            </td>
            <td style={{ ...bodyCell, fontWeight: 700, borderTop: '2px solid #000', textAlign: 'right' }}>
              {formatCurrency(data.payments.reduce((s, p) => s + p.total, 0))}
            </td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: 60, display: 'flex', gap: 40 }}>
        <div style={{ flex: 1, borderTop: '1px solid #000', paddingTop: 6, fontSize: 11, textAlign: 'center' }}>
          Conferido por
        </div>
        <div style={{ flex: 1, borderTop: '1px solid #000', paddingTop: 6, fontSize: 11, textAlign: 'center' }}>
          Data / Hora
        </div>
      </div>
    </div>
  )
}

const cellLabel: CSSProperties = { padding: '4px 0', fontSize: 13, color: '#333' }
const cellValue: CSSProperties = { padding: '4px 0', fontSize: 13, textAlign: 'right' }
const headerCell: CSSProperties = {
  borderBottom: '2px solid #000',
  padding: '6px 4px',
  fontSize: 12,
  textAlign: 'left',
}
const bodyCell: CSSProperties = { borderBottom: '1px solid #ccc', padding: '6px 4px', fontSize: 12 }
