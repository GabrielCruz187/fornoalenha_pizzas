import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { RouteErrorBoundary } from './RouteErrorBoundary'
import { ShortcutsHelpModal } from './ShortcutsHelpModal'
import { NAV_SHORTCUT_ROUTES, isTypingTarget } from '../../lib/shortcuts'
import { PRODUCT_SEARCH_ID } from '../order/ProductPicker'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const route = NAV_SHORTCUT_ROUTES[Number(e.key) - 1]
        if (route) {
          e.preventDefault()
          navigate(route)
        }
        return
      }
      if (e.ctrlKey || e.metaKey || isTypingTarget(e.target)) return
      if (e.key === '/') {
        const search = document.getElementById(PRODUCT_SEARCH_ID)
        if (search) {
          e.preventDefault()
          search.focus()
        }
      } else if (e.key === '?') {
        setHelpOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-bg">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} onShortcutsClick={() => setHelpOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {/* mode="wait" was removed: if a route switch interrupts the exit
              animation, AnimatePresence can stall waiting for it and never
              mount the next page, leaving the content area stuck empty. */}
          <AnimatePresence>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6"
            >
              <RouteErrorBoundary routeKey={location.pathname}>
                <Outlet />
              </RouteErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ShortcutsHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
