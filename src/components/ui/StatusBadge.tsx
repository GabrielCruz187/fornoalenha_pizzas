import { CheckCircle2, Circle, Ban, AlertTriangle, PackageCheck } from 'lucide-react'
import { STATUS_LABELS, type OrderStatus } from '../../types'
import { cn } from '../../lib/cn'

const STATUS_STYLE: Record<OrderStatus, { text: string; bg: string; icon: typeof Circle }> = {
  novo: { text: 'text-status-new', bg: 'bg-status-new-bg', icon: Circle },
  impresso: { text: 'text-status-printed', bg: 'bg-status-printed-bg', icon: CheckCircle2 },
  erro_impressao: { text: 'text-status-error', bg: 'bg-status-error-bg', icon: AlertTriangle },
  concluido: { text: 'text-status-done', bg: 'bg-status-done-bg', icon: PackageCheck },
  cancelado: { text: 'text-status-cancelled', bg: 'bg-status-cancelled-bg', icon: Ban },
}

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const style = STATUS_STYLE[status]
  const Icon = style.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        style.text,
        style.bg,
        className,
      )}
    >
      <Icon size={13} strokeWidth={2.5} />
      {STATUS_LABELS[status]}
    </span>
  )
}
