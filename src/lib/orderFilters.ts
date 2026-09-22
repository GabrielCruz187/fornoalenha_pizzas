import type { Order } from '../types'

export type DateFilter = 'hoje' | 'ontem' | '7dias' | 'todos'

export function matchesDateFilter(order: Order, filter: DateFilter, now: Date): boolean {
  if (filter === 'todos') return true
  const created = new Date(order.createdAt)
  const dayMs = 86_400_000
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

  if (filter === 'hoje') return startOfDay(created) === startOfDay(now)
  if (filter === 'ontem') return startOfDay(created) === startOfDay(now) - dayMs
  if (filter === '7dias') return startOfDay(created) >= startOfDay(now) - 6 * dayMs
  return true
}
