import { Printer, RotateCcw } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { KitchenTicket } from './KitchenTicket'
import { usePrintStore } from '../../store/usePrintStore'
import { useOrdersStore } from '../../store/useOrdersStore'
import { orderNumberLabel } from '../../lib/format'

export function PrintPreviewModal() {
  const preview = usePrintStore((s) => s.preview)
  const confirmPrint = usePrintStore((s) => s.confirmPrint)
  const closePreview = usePrintStore((s) => s.closePreview)
  // Read the live order so the reprint label reflects the latest print count.
  const order = useOrdersStore((s) => s.orders.find((o) => o.id === preview?.id)) ?? preview

  const isReprint = !!order && (order.printCount > 0 || order.status === 'erro_impressao')

  return (
    <Modal
      open={!!order}
      onClose={closePreview}
      title={order ? `Prévia · Pedido ${orderNumberLabel(order.number)}` : 'Prévia'}
      description="Confira o ticket antes de enviar para a impressora da cozinha."
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={closePreview}>
            Fechar
          </Button>
          <Button
            icon={isReprint ? <RotateCcw size={15} /> : <Printer size={15} />}
            onClick={confirmPrint}
          >
            {isReprint ? 'Reimprimir' : 'Imprimir'}
          </Button>
        </>
      }
    >
      {order && (
        <div className="flex justify-center">
          <div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black/20">
            <KitchenTicket order={order} />
          </div>
        </div>
      )}
    </Modal>
  )
}
