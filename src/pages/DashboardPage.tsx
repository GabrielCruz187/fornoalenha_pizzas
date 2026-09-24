import { DollarSign, Receipt, ShoppingBag, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { StatTile } from '../components/dashboard/StatTile'
import { PaymentBreakdownChart } from '../components/dashboard/PaymentBreakdownChart'
import { TopProductsChart } from '../components/dashboard/TopProductsChart'
import { OrdersTrendChart } from '../components/dashboard/OrdersTrendChart'
import { ChipTabs } from '../components/ui/ChipTabs'
import { useOrdersStore } from '../store/useOrdersStore'
import { matchesDateFilter, type DateFilter } from '../lib/orderFilters'
import { computeKpis, computeOrdersPerDay, computePaymentBreakdown, computeTopProducts } from '../lib/dashboardStats'
import { formatCurrency } from '../lib/format'

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
          <ChipTabs groupId="dashboard-period" ariaLabel="Período" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Pedidos', value: String(kpis.totalOrders), icon: ShoppingBag },
          { label: 'Faturamento', value: formatCurrency(kpis.revenue), icon: DollarSign },
          { label: 'Ticket médio', value: formatCurrency(kpis.averageTicket), icon: Receipt },
          {
            label: 'Cancelados',
            value: String(kpis.cancelled),
            icon: XCircle,
            sub: kpis.cancelled > 0 ? 'não contam no faturamento' : undefined,
          },
        ].map((tile, i) => (
          <StatTile key={tile.label} {...tile} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <h2 className="mb-3 text-sm font-semibold text-cream">Faturamento por forma de pagamento</h2>
          <PaymentBreakdownChart data={paymentData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <h2 className="mb-3 text-sm font-semibold text-cream">Produtos mais pedidos</h2>
          <TopProductsChart data={topProducts} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 rounded-xl border border-border bg-surface p-4"
      >
        <h2 className="mb-3 text-sm font-semibold text-cream">Pedidos por dia</h2>
        <OrdersTrendChart data={trendData.map((d) => ({ label: d.label, count: d.count }))} />
      </motion.div>
    </div>
  )
}
