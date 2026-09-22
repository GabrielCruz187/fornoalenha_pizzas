import { DollarSign, Receipt, ShoppingBag, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { StatTile } from '../components/dashboard/StatTile'
import { PaymentBreakdownChart } from '../components/dashboard/PaymentBreakdownChart'
import { TopProductsChart } from '../components/dashboard/TopProductsChart'
import { OrdersTrendChart } from '../components/dashboard/OrdersTrendChart'
import { useOrdersStore } from '../store/useOrdersStore'
import { matchesDateFilter, type DateFilter } from '../lib/orderFilters'
import { computeKpis, computeOrdersPerDay, computePaymentBreakdown, computeTopProducts } from '../lib/dashboardStats'
import { formatCurrency } from '../lib/format'
import { cn } from '../lib/cn'

const PERIOD_OPTIONS: { value: DateFilter; label: string; days: number }[] = [
  { value: 'hoje', label: 'Hoje', days: 1 },
  { value: '7dias', label: '7 dias', days: 7 },
  { value: 'todos', label: '30 dias', days: 30 },
]

export function DashboardPage() {
  const orders = useOrdersStore((s) => s.orders)
  const [period, setPeriod] = useState<DateFilter>('7dias')
  const now = useMemo(() => new Date(), [])

  const filteredOrders = useMemo(() => {
    if (period === 'todos') {
      const cutoff = now.getTime() - 29 * 86_400_000
      return orders.filter((o) => new Date(o.createdAt).getTime() >= cutoff)
    }
    return orders.filter((o) => matchesDateFilter(o, period, now))
  }, [orders, period, now])

  const kpis = useMemo(() => computeKpis(filteredOrders), [filteredOrders])
  const paymentData = useMemo(() => computePaymentBreakdown(filteredOrders), [filteredOrders])
  const topProducts = useMemo(() => computeTopProducts(filteredOrders), [filteredOrders])
  const trendDays = PERIOD_OPTIONS.find((p) => p.value === period)?.days ?? 7
  const trendData = useMemo(() => computeOrdersPerDay(orders, trendDays), [orders, trendDays])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do movimento"
        actions={
          <div className="flex gap-1.5" role="tablist" aria-label="Período">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                role="tab"
                aria-selected={period === opt.value}
                onClick={() => setPeriod(opt.value)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  period === opt.value
                    ? 'bg-gold-500 text-[#1a1310]'
                    : 'bg-surface-raised text-cream-dim hover:bg-surface-hover hover:text-cream',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Pedidos" value={String(kpis.totalOrders)} icon={ShoppingBag} />
        <StatTile label="Faturamento" value={formatCurrency(kpis.revenue)} icon={DollarSign} />
        <StatTile label="Ticket médio" value={formatCurrency(kpis.averageTicket)} icon={Receipt} />
        <StatTile
          label="Cancelados"
          value={String(kpis.cancelled)}
          icon={XCircle}
          sub={kpis.cancelled > 0 ? 'não contam no faturamento' : undefined}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-cream">Faturamento por forma de pagamento</h2>
          <PaymentBreakdownChart data={paymentData} />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-cream">Produtos mais pedidos</h2>
          <TopProductsChart data={topProducts} />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-cream">Pedidos por dia</h2>
        <OrdersTrendChart data={trendData.map((d) => ({ label: d.label, count: d.count }))} />
      </div>
    </div>
  )
}
