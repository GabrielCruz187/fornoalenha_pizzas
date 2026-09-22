import type { Order, PaymentMethod } from '../types'
import { PAYMENT_LABELS } from '../types'

export function computeKpis(orders: Order[]) {
  const valid = orders.filter((o) => o.status !== 'cancelado')
  const revenue = valid.reduce((sum, o) => sum + o.total, 0)
  const cancelled = orders.length - valid.length
  return {
    totalOrders: valid.length,
    revenue,
    averageTicket: valid.length ? revenue / valid.length : 0,
    cancelled,
  }
}

export function computePaymentBreakdown(orders: Order[]) {
  const valid = orders.filter((o) => o.status !== 'cancelado')
  const byMethod = new Map<PaymentMethod, { total: number; count: number }>()
  for (const method of Object.keys(PAYMENT_LABELS) as PaymentMethod[]) {
    byMethod.set(method, { total: 0, count: 0 })
  }
  for (const order of valid) {
    const entry = byMethod.get(order.paymentMethod)!
    entry.total += order.total
    entry.count += 1
  }
  return Array.from(byMethod.entries()).map(([method, data]) => ({
    method,
    label: PAYMENT_LABELS[method],
    ...data,
  }))
}

export function computeTopProducts(orders: Order[], limit = 8) {
  const valid = orders.filter((o) => o.status !== 'cancelado')
  const byName = new Map<string, number>()
  for (const order of valid) {
    for (const item of order.items) {
      byName.set(item.name, (byName.get(item.name) ?? 0) + item.quantity)
    }
  }
  return Array.from(byName.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
}

export interface CashClosingData {
  dateLabel: string
  totalOrders: number
  cancelledOrders: number
  revenue: number
  payments: { label: string; total: number; count: number }[]
}

export function computeOrdersPerDay(orders: Order[], days: number) {
  const valid = orders.filter((o) => o.status !== 'cancelado')
  const now = new Date()
  const buckets: { date: string; label: string; count: number; revenue: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    buckets.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      count: 0,
      revenue: 0,
    })
  }
  const byDate = new Map(buckets.map((b) => [b.date, b]))
  for (const order of valid) {
    const key = new Date(order.createdAt).toISOString().slice(0, 10)
    const bucket = byDate.get(key)
    if (bucket) {
      bucket.count += 1
      bucket.revenue += order.total
    }
  }
  return buckets
}
