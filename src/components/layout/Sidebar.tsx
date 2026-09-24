import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, ClipboardList, BookOpen, Wallet, ChefHat, X } from 'lucide-react'
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

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-60 shrink-0 flex-col border-r border-border bg-bg-soft transition-transform duration-300 ease-out',
          'lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col items-center gap-2.5 border-b border-border px-5 py-6 text-center">
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-muted hover:bg-surface-hover hover:text-cream lg:hidden"
          >
            <X size={18} />
          </button>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="relative"
          >
            <span className="absolute inset-0 -z-10 rounded-full bg-ember-500/25 blur-lg animate-flicker" aria-hidden />
            <img
              src={logo}
              alt="Forno a Lenha"
              className="h-24 w-24 rounded-full border-2 border-gold-600/60 object-cover shadow-lg shadow-black/40"
            />
          </motion.div>
          <div>
            <div className="font-display text-base font-semibold leading-tight text-cream">Forno a Lenha</div>
            <div className="text-[11px] leading-tight text-muted">Pizzas &amp; Petiscos</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navegação principal">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
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
                  <span className="relative z-10 flex shrink-0">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
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
    </>
  )
}
