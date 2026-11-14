import type { Order } from '../types'

export interface KnownCustomer {
  name: string
  phone: string
  address?: string
  addressReference?: string
  orderCount: number
  averageTicket: number
  lastOrderAt: string
}

/** Digits only, without Brazil's country code, so "+55 (11) 91234-5678" matches "11912345678". */
export function phoneKey(phone?: string): string {
  const digits = (phone ?? '').replace(/\D/g, '')
  return digits.length > 11 && digits.startsWith('55') ? digits.slice(2) : digits
}

/**
 * Builds a customer profile from past orders with the same phone. There is no
 * separate customers table: the order history is the single source of truth.
 * `orders` is newest-first, so the first match carries the latest name/address.
 */
export function findCustomerByPhone(orders: Order[], phone: string): KnownCustomer | null {
  const key = phoneKey(phone)
  if (key.length < 10) return null

  const matches = orders.filter((o) => o.status !== 'cancelado' && phoneKey(o.customerPhone) === key)
  if (matches.length === 0) return null

  const latest = matches[0]
  const lastDelivery = matches.find((o) => o.deliveryType === 'entrega' && o.address)
  const spent = matches.reduce((sum, o) => sum + o.total, 0)

  return {
    name: latest.customerName,
    phone: latest.customerPhone ?? phone,
    address: lastDelivery?.address,
    addressReference: lastDelivery?.addressReference,
    orderCount: matches.length,
    averageTicket: spent / matches.length,
    lastOrderAt: latest.createdAt,
  }
}
