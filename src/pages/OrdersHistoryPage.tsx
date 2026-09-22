import { ClipboardList, Printer, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ChipTabs } from '../components/ui/ChipTabs'
import { OrderDetailDrawer } from '../components/orders/OrderDetailDrawer'
import { useOrdersStore } from '../store/useOrdersStore'
import { usePrintStore } from '../store/usePrintStore'
import { formatCurrency, formatTime, orderNumberLabel } from '../lib/format'
import { matchesDateFilter, type DateFilter } from '../lib/orderFilters'
import { PAYMENT_LABELS, STATUS_LABELS, type OrderStatus } from '../types'

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'ontem', label: 'Ontem' },
  { value: '7dias', label: '7 dias' },
  { value: 'todos', label: 'Todos' },
]

const STATUS_OPTIONS: { value: OrderStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'novo', label: STATUS_LABELS.novo },
  { value: 'impresso', label: STATUS_LABELS.impresso },
  { value: 'erro_impressao', label: STATUS_LABELS.erro_impressao },
  { value: 'concluido', label: STATUS_LABELS.concluido },
  { value: 'cancelado', label: STATUS_LABELS.cancelado },
]

export function OrdersHistoryPage() {
  const orders = useOrdersStore((s) => s.orders)
  const requestPrint = usePrintStore((s) => s.requestPrint)
  const [dateFilter, setDateFilter] = useState<DateFilter>('hoje')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedOrder = useMemo(() => orders.find((o) => o.id === selectedId) ?? null, [orders, selectedId])

  const now = useMemo(() => new Date(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (!matchesDateFilter(o, dateFilter, now)) return false
      if (statusFilter !== 'todos' && o.status !== statusFilter) return false
      if (q) {
        const haystack = `${orderNumberLabel(o.number)} ${o.customerName} ${o.customerPhone ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [orders, dateFilter, statusFilter, query, now])

  return (
    <div>
      <PageHeader title="Pedidos" subtitle="Histórico e acompanhamento do dia a dia" />

      <div className="mb-4 flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por número, cliente ou telefone…"
            aria-label="Buscar pedidos"
            className="w-full max-w-md rounded-lg border border-border bg-bg-soft py-2.5 pl-9 pr-3 text-sm text-cream placeholder:text-muted-dim focus:border-gold-500/70 focus:outline-none focus:ring-1 focus:ring-gold-500/40"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ChipTabs
            groupId="orders-date"
            ariaLabel="Filtrar por período"
            options={DATE_OPTIONS}
            value={dateFilter}
            onChange={setDateFilter}
          />
          <ChipTabs
            groupId="orders-status"
            ariaLabel="Filtrar por status"
            variant="outline"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nenhum pedido encontrado"
          description="Ajuste os filtros ou lance um novo pedido para vê-lo aqui."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Itens</th>
                <th className="px-4 py-3 font-medium">Pagamento</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium sr-only">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i, 8) * 0.02 }}
                  className="cursor-pointer border-b border-border bg-surface last:border-0 hover:bg-surface-hover"
                  onClick={() => setSelectedId(order.id)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-cream">{orderNumberLabel(order.number)}</div>
                    <div className="text-xs text-muted">{formatTime(order.createdAt)}</div>
                  </td>
                  <td className="px-4 py-3 text-cream-dim">{order.customerName}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-muted">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-muted">{PAYMENT_LABELS[order.paymentMethod]}</td>
                  <td className="px-4 py-3 font-medium text-gold-400">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9, rotate: -8 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        requestPrint(order)
                      }}
                      aria-label={`Reimprimir pedido ${orderNumberLabel(order.number)}`}
                      className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-gold-400"
                    >
                      <Printer size={15} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedId(null)} />
    </div>
  )
}
