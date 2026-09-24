import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  delay = 0,
}: {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.2 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-gold-500/40"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
        <Icon size={16} className="text-gold-500" strokeWidth={1.8} />
      </div>
      <div
        className="font-display text-2xl font-bold text-cream"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </motion.div>
  )
}
