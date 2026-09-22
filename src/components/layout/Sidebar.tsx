import { motion } from 'framer-motion'
import { LayoutDashboard, ClipboardList, BookOpen, Wallet, ChefHat } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import logo from '../../assets/logo.jpg'

const NAV_ITEMS = [
  { to: '/', label: 'Novo Pedido', icon: ChefHat, end: true },
  { to: '/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/cardapio', label: 'Cardápio', icon: BookOpen },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/caixa', label: 'Fechamento de Caixa', icon: Wallet },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-bg-soft">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <img
          src={logo}
          alt="Forno a Lenha"
          className="h-11 w-11 rounded-full border border-gold-700/50 object-cover animate-flicker"
        />
        <div>
          <div className="font-display text-sm font-semibold leading-tight text-cream">Forno a Lenha</div>
          <div className="text-[11px] leading-tight text-muted">Pizzas &amp; Petiscos</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'text-gold-300' : 'text-cream-dim hover:bg-surface-hover hover:text-cream',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-surface-raised ring-1 ring-gold-700/40"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={17} className="relative z-10 shrink-0" strokeWidth={1.8} />
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-5 py-4 text-[11px] text-muted-dim">
        Painel interno · uso exclusivo da equipe
      </div>
    </aside>
  )
}
