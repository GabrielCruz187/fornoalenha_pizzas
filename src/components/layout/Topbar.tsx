import { Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useOrdersStore } from '../../store/useOrdersStore'
import { isSameDay } from '../../lib/format'

export function Topbar() {
  const [now, setNow] = useState(new Date())
  const orders = useOrdersStore((s) => s.orders)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const openToday = orders.filter(
    (o) => isSameDay(o.createdAt, now.toISOString()) && (o.status === 'novo' || o.status === 'impresso'),
  ).length

  return (
    <header className="flex items-center justify-end gap-4 border-b border-border bg-bg/80 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-4">
        {openToday > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-ember-700/40 bg-ember-700/10 px-3 py-1.5 text-xs font-medium text-ember-300">
            <Flame size={14} className="animate-flicker" />
            {openToday} pedido{openToday === 1 ? '' : 's'} em aberto hoje
          </div>
        )}
        <div className="text-right">
          <div className="text-sm font-medium text-cream">
            {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-muted">
            {now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
          </div>
        </div>
      </div>
    </header>
  )
}
