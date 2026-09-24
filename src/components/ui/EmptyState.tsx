import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-raised text-gold-400"
      >
        <Icon size={26} strokeWidth={1.6} />
      </motion.div>
      <h3 className="font-display text-base font-semibold text-cream">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}
