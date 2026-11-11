import { formatCurrency, orderNumberLabel } from './format'
import { PAYMENT_LABELS, type Order } from '../types'

export type WhatsappMessageKind = 'confirmacao' | 'pronto'

/** Digits only, with Brazil's country code (55) added when missing. */
export function whatsappNumber(phone?: string): string | null {
  const digits = (phone ?? '').replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return digits
  return null
}

export function buildWhatsappMessage(order: Order, kind: WhatsappMessageKind): string {
  const number = orderNumberLabel(order.number)
  const name = order.customerName.split(' ')[0]

  if (kind === 'pronto') {
    return order.deliveryType === 'entrega'
      ? `Olá, ${name}! Seu pedido ${number} saiu para entrega. 🛵\nTotal: ${formatCurrency(order.total)}. Bom apetite! 🍕`
      : `Olá, ${name}! Seu pedido ${number} está pronto para retirada. 🍕\nTotal: ${formatCurrency(order.total)}.`
  }

  const items = order.items.map((i) => `• ${i.quantity}x ${i.name}`).join('\n')
  const where = order.deliveryType === 'entrega' ? `Entrega em: ${order.address ?? ''}` : 'Retirada no balcão'
  return [
    `Olá, ${name}! Recebemos o seu pedido ${number} no Forno a Lenha. 🔥`,
    '',
    items,
    '',
    where,
    `Pagamento: ${PAYMENT_LABELS[order.paymentMethod]}`,
    `Total: ${formatCurrency(order.total)}`,
  ].join('\n')
}

export function whatsappUrl(order: Order, kind: WhatsappMessageKind): string | null {
  const number = whatsappNumber(order.customerPhone)
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsappMessage(order, kind))}`
}
