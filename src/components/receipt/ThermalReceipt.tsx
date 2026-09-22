import { formatCurrency, formatDateTime, orderNumberLabel } from '../../lib/format'
import { PAYMENT_LABELS, PIZZA_SIZE_LABELS, type Order } from '../../types'

function Divider() {
  return <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }} />
}

export function ThermalReceipt({ order }: { order: Order }) {
  return (
    <div
      style={{
        width: '80mm',
        boxSizing: 'border-box',
        padding: '10px 8px',
        fontSize: 12,
        lineHeight: 1.45,
        fontFamily: '"Courier New", monospace',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>FORNO A LENHA</div>
        <div style={{ fontSize: 11 }}>Pizzas &amp; Petiscos</div>
      </div>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}>
        <span>Pedido {orderNumberLabel(order.number)}</span>
        <span>{order.deliveryType === 'entrega' ? 'ENTREGA' : 'RETIRADA'}</span>
      </div>
      <div>{formatDateTime(order.createdAt)}</div>
      <Divider />
      <div>
        <strong>Cliente:</strong> {order.customerName}
      </div>
      {order.customerPhone && (
        <div>
          <strong>Telefone:</strong> {order.customerPhone}
        </div>
      )}
      {order.deliveryType === 'entrega' && order.address && (
        <div>
          <strong>Endereço:</strong> {order.address}
          {order.addressReference && ` (${order.addressReference})`}
        </div>
      )}
      <Divider />
      {order.items.map((item) => (
        <div key={item.id} style={{ marginBottom: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>
              {item.quantity}x {item.name}
            </span>
            <span>{formatCurrency(item.lineTotal)}</span>
          </div>
          {item.size && (
            <div style={{ fontSize: 11 }}>
              Tamanho: {PIZZA_SIZE_LABELS[item.size]}
              {item.border ? ' + Borda recheada' : ''}
            </div>
          )}
          {item.variantLabel && <div style={{ fontSize: 11 }}>{item.variantLabel}</div>}
          {item.notes && <div style={{ fontSize: 11 }}>Obs: {item.notes}</div>}
        </div>
      ))}
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
      <Divider />
      <div>
        <strong>Pagamento:</strong> {PAYMENT_LABELS[order.paymentMethod]}
      </div>
      {order.paymentMethod === 'dinheiro' && order.changeFor !== undefined && order.changeFor > 0 && (
        <div>
          <strong>Troco para:</strong> {formatCurrency(order.changeFor)} (levar{' '}
          {formatCurrency(Math.max(0, order.changeFor - order.total))})
        </div>
      )}
      {order.notes && (
        <>
          <Divider />
          <div>
            <strong>Observações:</strong> {order.notes}
          </div>
        </>
      )}
      <Divider />
      <div style={{ textAlign: 'center', fontSize: 11 }}>Obrigado pela preferência!</div>
    </div>
  )
}
