import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { RouteErrorBoundary } from './RouteErrorBoundary'

export function AppShell() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-bg">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {/* mode="wait" was removed: if a route switch interrupts the exit
              animation, AnimatePresence can stall waiting for it and never
              mount the next page, leaving the content area stuck empty. */}
          <AnimatePresence>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6"
            >
              <RouteErrorBoundary routeKey={location.pathname}>
                <Outlet />
              </RouteErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
