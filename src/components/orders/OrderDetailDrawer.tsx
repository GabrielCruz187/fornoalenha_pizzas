import { useState } from 'react'
import { Ban, CheckCircle2, Printer } from 'lucide-react'
import { Drawer } from '../ui/Drawer'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/StatusBadge'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { formatCurrency, formatDateTime, orderNumberLabel } from '../../lib/format'
import { PAYMENT_LABELS, PIZZA_SIZE_LABELS, type Order } from '../../types'
import { useOrdersStore } from '../../store/useOrdersStore'
import { usePrintStore } from '../../store/usePrintStore'

interface OrderDetailDrawerProps {
  order: Order | null
  onClose: () => void
}

export function OrderDetailDrawer({ order, onClose }: OrderDetailDrawerProps) {
  const markConcluded = useOrdersStore((s) => s.markConcluded)
  const markPrintError = useOrdersStore((s) => s.markPrintError)
  const cancelOrder = useOrdersStore((s) => s.cancelOrder)
  const requestPrint = usePrintStore((s) => s.requestPrint)
  const [confirmCancel, setConfirmCancel] = useState(false)

  if (!order) return null

  const canOperate = order.status !== 'cancelado'

  return (
    <>
      <Drawer open={!!order} onClose={onClose} title={`Pedido ${orderNumberLabel(order.number)}`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <span className="text-xs text-muted">{formatDateTime(order.createdAt)}</span>
          </div>

          <div className="rounded-lg border border-border bg-bg-soft p-3 text-sm">
            <p className="font-medium text-cream">{order.customerName}</p>
            {order.customerPhone && <p className="text-muted">{order.customerPhone}</p>}
            <p className="mt-1 text-cream-dim">
              {order.deliveryType === 'entrega' ? 'Entrega' : 'Retirada no balcão'}
            </p>
            {order.deliveryType === 'entrega' && order.address && (
              <p className="text-muted">
                {order.address}
                {order.addressReference && ` (${order.addressReference})`}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-bg-soft p-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-cream">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-gold-400">{formatCurrency(item.lineTotal)}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {item.size && PIZZA_SIZE_LABELS[item.size]}
                  {item.border && ' + borda'}
                  {item.variantLabel}
                  {item.notes && ` · ${item.notes}`}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-bg-soft p-3 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-muted">
                <span>Taxa de entrega</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-muted">
                <span>Desconto</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="mt-1 flex justify-between border-t border-border pt-1 font-semibold text-cream">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="mt-2 text-muted">
              {PAYMENT_LABELS[order.paymentMethod]}
              {order.paymentMethod === 'dinheiro' && order.changeFor ? ` · troco para ${formatCurrency(order.changeFor)}` : ''}
            </div>
          </div>

          {order.notes && (
            <div className="rounded-lg border border-border bg-bg-soft p-3 text-sm text-muted">
              <span className="text-cream-dim">Observações:</span> {order.notes}
            </div>
          )}

          {order.cancelReason && (
            <div className="rounded-lg border border-status-error/30 bg-status-error-bg p-3 text-sm text-status-error">
              Motivo do cancelamento: {order.cancelReason}
            </div>
          )}

          <p className="text-xs text-muted-dim">
            Impresso {order.printCount}x
            {order.printCount === 0 && ' · ainda não enviado à impressora'}
          </p>

          {canOperate && (
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="secondary" icon={<Printer size={15} />} onClick={() => requestPrint(order)}>
                Reimprimir comanda
              </Button>
              {order.status !== 'concluido' && (
                <Button
                  variant="secondary"
                  icon={<CheckCircle2 size={15} />}
                  onClick={() => markConcluded(order.id)}
                >
                  Marcar como concluído
                </Button>
              )}
              {order.status !== 'erro_impressao' && (
                <Button variant="ghost" onClick={() => markPrintError(order.id)}>
                  Marcar erro de impressão
                </Button>
              )}
              <Button variant="danger" icon={<Ban size={15} />} onClick={() => setConfirmCancel(true)}>
                Cancelar pedido
              </Button>
            </div>
          )}
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={(reason) => {
          cancelOrder(order.id, reason)
          setConfirmCancel(false)
        }}
        title="Cancelar pedido?"
        description={`O pedido ${orderNumberLabel(order.number)} será marcado como cancelado. Essa ação não apaga o histórico.`}
        confirmLabel="Cancelar pedido"
        askReason
      />
    </>
  )
}
