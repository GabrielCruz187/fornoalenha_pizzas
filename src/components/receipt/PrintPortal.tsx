import { useEffect } from 'react'
import { usePrintStore } from '../../store/usePrintStore'
import { useOrdersStore } from '../../store/useOrdersStore'
import { useToastStore } from '../../store/useToastStore'
import { orderNumberLabel } from '../../lib/format'
import { ThermalReceipt } from './ThermalReceipt'
import { CashClosingReport } from './CashClosingReport'

const PAGE_STYLE_ID = 'dynamic-print-page-style'

function setPageSize(css: string) {
  let style = document.getElementById(PAGE_STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = PAGE_STYLE_ID
    document.head.appendChild(style)
  }
  style.textContent = css
}

/**
 * Always mounted at the app root. When a print job is requested, the content
 * is rendered off-screen and window.print() is triggered on the next frame so
 * the browser has painted it. `afterprint` fires whether the user printed or
 * cancelled the dialog — we optimistically mark receipts printed either way
 * since a no-backend setup can't observe the physical printer's result.
 */
export function PrintPortal() {
  const job = usePrintStore((s) => s.job)
  const clear = usePrintStore((s) => s.clear)
  const markPrinted = useOrdersStore((s) => s.markPrinted)
  const registerReprint = useOrdersStore((s) => s.registerReprint)
  const push = useToastStore((s) => s.push)

  useEffect(() => {
    if (!job) return

    setPageSize(
      job.type === 'receipt' ? '@page { size: 80mm auto; margin: 0; }' : '@page { size: A4; margin: 14mm; }',
    )

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => window.print())
    })

    const onAfterPrint = () => {
      if (job.type === 'receipt') {
        const { order } = job
        if (order.printCount === 0) markPrinted(order.id)
        else registerReprint(order.id)
        push({
          variant: 'success',
          message: `Pedido ${orderNumberLabel(order.number)} enviado para impressão`,
          description: 'Confira a comanda na impressora da cozinha.',
        })
      } else {
        push({ variant: 'success', message: 'Fechamento de caixa enviado para impressão' })
      }
      clear()
    }

    window.addEventListener('afterprint', onAfterPrint)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('afterprint', onAfterPrint)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job])

  return (
    <div className="print-root">
      <div className="print-area">
        {job?.type === 'receipt' && <ThermalReceipt order={job.order} />}
        {job?.type === 'cashClosing' && <CashClosingReport data={job.data} />}
      </div>
    </div>
  )
}
