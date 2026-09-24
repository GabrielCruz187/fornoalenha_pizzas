import { DollarSign, Printer, Receipt, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { StatTile } from '../components/dashboard/StatTile'
import { Button } from '../components/ui/Button'
import { useOrdersStore } from '../store/useOrdersStore'
import { usePrintStore } from '../store/usePrintStore'
import { computeKpis, computePaymentBreakdown, type CashClosingData } from '../lib/dashboardStats'
import { formatCurrency } from '../lib/format'
import { useChartPalette } from '../lib/chartColors'

function todayInputValue() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function CashClosingPage() {
  const orders = useOrdersStore((s) => s.orders)
  const requestCashClosingPrint = usePrintStore((s) => s.requestCashClosingPrint)
  const palette = useChartPalette()
  const [dateValue, setDateValue] = useState(todayInputValue())

  const dayOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      return key === dateValue
    })
  }, [orders, dateValue])

  const kpis = useMemo(() => computeKpis(dayOrders), [dayOrders])
  const payments = useMemo(() => computePaymentBreakdown(dayOrders), [dayOrders])

  const dateLabel = useMemo(
    () => new Date(`${dateValue}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    [dateValue],
  )

  const handlePrint = () => {
    const data: CashClosingData = {
      dateLabel,
      totalOrders: kpis.totalOrders,
      cancelledOrders: kpis.cancelled,
      revenue: kpis.revenue,
      payments: payments.map((p) => ({ label: p.label, total: p.total, count: p.count })),
    }
    requestCashClosingPrint(data)
  }

  return (
    <div>
      <PageHeader
        title="Fechamento de Caixa"
        subtitle="Resumo do dia para conferência"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              aria-label="Selecionar data"
              className="rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm text-cream focus:border-gold-500/70 focus:outline-none"
            />
            <Button icon={<Printer size={16} />} onClick={handlePrint}>
              Imprimir fechamento
            </Button>
          </div>
        }
      />

      <p className="mb-4 text-sm capitalize text-muted">{dateLabel}</p>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Pedidos válidos" value={String(kpis.totalOrders)} icon={Receipt} delay={0} />
        <StatTile label="Faturamento" value={formatCurrency(kpis.revenue)} icon={DollarSign} delay={0.05} />
        <StatTile label="Ticket médio" value={formatCurrency(kpis.averageTicket)} icon={Receipt} delay={0.1} />
        <StatTile label="Cancelados" value={String(kpis.cancelled)} icon={XCircle} delay={0.15} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Forma de pagamento</th>
              <th className="px-4 py-3 font-medium">Pedidos</th>
              <th className="px-4 py-3 text-right font-medium">Total recebido</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.method} className="border-b border-border bg-surface last:border-0">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-cream-dim">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: palette.paymentColors[p.method] }}
                      aria-hidden
                    />
                    {p.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{p.count}</td>
                <td className="px-4 py-3 text-right font-medium text-gold-400">{formatCurrency(p.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-surface-raised">
              <td className="px-4 py-3 font-semibold text-cream">Total</td>
              <td className="px-4 py-3 font-semibold text-cream">{payments.reduce((s, p) => s + p.count, 0)}</td>
              <td className="px-4 py-3 text-right font-semibold text-gold-400">
                {formatCurrency(payments.reduce((s, p) => s + p.total, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
