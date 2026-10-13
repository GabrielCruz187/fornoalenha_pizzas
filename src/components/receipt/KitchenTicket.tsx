import { formatCurrency, formatDateTime, orderNumberLabel } from '../../lib/format'
import { PAYMENT_LABELS, PIZZA_SIZE_LABELS, type Order } from '../../types'

function Divider() {
  return <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
}

/**
 * Kitchen ticket: what has to be prepared, plus values and payment. Used both for
 * the on-screen preview and for the actual print, so what the user sees is
 * exactly what comes out of the printer.
 */
export function KitchenTicket({ order }: { order: Order }) {
  const isReprint = order.printCount > 0

  return (
    <div
      style={{
        width: '80mm',
        boxSizing: 'border-box',
        padding: '10px 8px',
        fontSize: 12,
        lineHeight: 1.45,
        fontFamily: '"Courier New", monospace',
        color: '#000',
        background: '#fff',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
          COZINHA{isReprint ? ' · REIMPRESSÃO' : ''}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700 }}>{orderNumberLabel(order.number)}</div>
        <div style={{ fontWeight: 700 }}>{order.deliveryType === 'entrega' ? 'ENTREGA' : 'RETIRADA'}</div>
        <div>{formatDateTime(order.createdAt)}</div>
      </div>
      <Divider />
      <div>
        <strong>Cliente:</strong> {order.customerName}
      </div>
      <Divider />
      {order.items.map((item) => (
        <div key={item.id} style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, fontWeight: 700, fontSize: 14 }}>
            <span>
              {item.quantity}x {item.name}
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>{formatCurrency(item.lineTotal)}</span>
          </div>
          {item.size && <div>Tamanho: {PIZZA_SIZE_LABELS[item.size]}</div>}
          {item.border && <div>+ Borda recheada</div>}
          {item.variantLabel && <div>{item.variantLabel}</div>}
          {item.notes && <div style={{ fontWeight: 700 }}>OBS: {item.notes}</div>}
        </div>
      ))}
      {order.notes && (
        <>
          <Divider />
          <div style={{ fontWeight: 700 }}>OBS DO PEDIDO: {order.notes}</div>
        </>
      )}
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Subtotal</span>
        <span>{formatCurrency(order.subtotal)}</span>
      </div>
      {order.deliveryFee > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Taxa de entrega</span>
          <span>{formatCurrency(order.deliveryFee)}</span>
        </div>
      )}
      {order.discount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Desconto</span>
          <span>-{formatCurrency(order.discount)}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, marginTop: 4 }}>
        <span>TOTAL</span>
        <span>{formatCurrency(order.total)}</span>
      </div>
      <div style={{ marginTop: 4 }}>
        <strong>Pagamento:</strong> {PAYMENT_LABELS[order.paymentMethod]}
      </div>
      {order.paymentMethod === 'dinheiro' && order.changeFor !== undefined && order.changeFor > 0 && (
        <div>
          <strong>Troco para:</strong> {formatCurrency(order.changeFor)} (levar{' '}
          {formatCurrency(Math.max(0, order.changeFor - order.total))})
        </div>
      )}
      <Divider />
      <div style={{ textAlign: 'center', fontSize: 11 }}>Impresso às {formatDateTime(new Date().toISOString())}</div>
    </div>
  )
}
