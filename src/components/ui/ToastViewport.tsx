import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useToastStore, type ToastVariant } from '../../store/useToastStore'
import { cn } from '../../lib/cn'

const VARIANT_STYLE: Record<ToastVariant, { icon: typeof CheckCircle2; text: string; border: string }> = {
  success: { icon: CheckCircle2, text: 'text-status-printed', border: 'border-status-printed/40' },
  error: { icon: AlertCircle, text: 'text-status-error', border: 'border-status-error/40' },
  info: { icon: Info, text: 'text-status-new', border: 'border-status-new/40' },
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = VARIANT_STYLE[toast.variant]
          const Icon = style.icon
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-surface-raised px-4 py-3 shadow-xl',
                style.border,
              )}
            >
              <Icon size={18} className={cn('mt-0.5 shrink-0', style.text)} />
              <div className="flex-1">
                <p className="text-sm font-medium text-cream">{toast.message}</p>
                {toast.description && <p className="mt-0.5 text-xs text-muted">{toast.description}</p>}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Fechar notificação"
                className="text-muted hover:text-cream"
              >
                <X size={15} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
