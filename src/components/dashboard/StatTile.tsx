import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedNumber } from '../ui/AnimatedNumber'

export function StatTile({
  label,
  amount,
  format,
  sub,
  icon: Icon,
  delay = 0,
}: {
  label: string
  amount: number
  format: (n: number) => string
  sub?: string
  icon: LucideIcon
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-gold-500/50"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
        <motion.span
          className="text-gold-500"
          whileHover={{ rotate: [0, -14, 14, -8, 0], scale: 1.25 }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={16} strokeWidth={1.8} />
        </motion.span>
      </div>
      <div
        className="font-display text-2xl font-bold text-cream"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        <AnimatedNumber value={amount} format={format} delay={delay} />
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </motion.div>
  )
}
