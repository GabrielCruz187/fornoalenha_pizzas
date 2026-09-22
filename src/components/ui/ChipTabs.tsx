import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

interface ChipOption<T extends string> {
  value: T
  label: string
}

interface ChipTabsProps<T extends string> {
  groupId: string
  options: ChipOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  variant?: 'solid' | 'outline'
}

export function ChipTabs<T extends string>({
  groupId,
  options,
  value,
  onChange,
  ariaLabel,
  variant = 'solid',
}: ChipTabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => {
        const isActive = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              variant === 'outline' && 'border',
              isActive
                ? variant === 'solid'
                  ? 'text-[#1a1310]'
                  : 'border-gold-500 text-gold-300'
                : variant === 'solid'
                  ? 'bg-surface-raised text-cream-dim hover:bg-surface-hover hover:text-cream'
                  : 'border-border text-cream-dim hover:bg-surface-hover hover:text-cream',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`chip-${groupId}`}
                className={cn(
                  'absolute inset-0 rounded-full',
                  variant === 'solid' ? 'bg-gold-500' : 'bg-gold-500/10 ring-1 ring-gold-500',
                )}
                transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
