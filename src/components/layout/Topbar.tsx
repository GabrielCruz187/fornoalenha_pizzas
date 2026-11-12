import { Flame, Keyboard, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useOrdersStore } from '../../store/useOrdersStore'
import { isSameDay } from '../../lib/format'
import { ThemeToggle } from './ThemeToggle'

interface TopbarProps {
  onMenuClick: () => void
  onShortcutsClick: () => void
}

export function Topbar({ onMenuClick, onShortcutsClick }: TopbarProps) {
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
    <header className="flex items-center justify-between gap-3 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur sm:justify-end sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="rounded-lg p-2 text-cream-dim hover:bg-surface-hover hover:text-cream lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
        {openToday > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-ember-700/40 bg-ember-700/10 px-3 py-1.5 text-xs font-medium text-ember-300">
            <Flame size={14} className="animate-flicker" />
            <span className="hidden sm:inline">
              {openToday} pedido{openToday === 1 ? '' : 's'} em aberto hoje
            </span>
            <span className="sm:hidden">{openToday} em aberto</span>
          </div>
        )}
        <div className="text-right">
          <div className="text-sm font-medium text-cream">
            {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="hidden text-xs text-muted sm:block">
            {now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
          </div>
        </div>
        <button
          onClick={onShortcutsClick}
          aria-label="Atalhos de teclado"
          title="Atalhos de teclado (?)"
          className="hidden h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-surface-raised text-cream-dim transition-colors hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 sm:flex"
        >
          <Keyboard size={16} />
        </button>
        <ThemeToggle />
      </div>
    </header>
  )
}
