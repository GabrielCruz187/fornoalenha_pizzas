import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { makeId } from '../lib/id'
import type { NewOrderInput, Order, OrderStatus } from '../types'

interface OrdersState {
  orders: Order[]
  nextNumber: number
  createOrder: (input: NewOrderInput) => Order
  markPrinted: (id: string) => void
  markPrintError: (id: string, error?: string) => void
  markConcluded: (id: string) => void
  cancelOrder: (id: string, reason?: string) => void
  registerReprint: (id: string) => void
}

function computeTotals(items: NewOrderInput['items'], deliveryFee: number, discount: number) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const total = Math.max(0, subtotal + deliveryFee - discount)
  return { subtotal, total }
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      nextNumber: 1,
      createOrder: (input) => {
        const { subtotal, total } = computeTotals(input.items, input.deliveryFee, input.discount)
        const now = new Date().toISOString()
        const order: Order = {
          id: makeId('order'),
          number: get().nextNumber,
          createdAt: now,
          updatedAt: now,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          deliveryType: input.deliveryType,
          address: input.address,
          addressReference: input.addressReference,
          items: input.items,
          paymentMethod: input.paymentMethod,
          changeFor: input.changeFor,
          deliveryFee: input.deliveryFee,
          discount: input.discount,
          notes: input.notes,
          subtotal,
          total,
          status: 'novo',
          printCount: 0,
        }
        set((state) => ({ orders: [order, ...state.orders], nextNumber: state.nextNumber + 1 }))
        return order
      },
      markPrinted: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? { ...o, status: 'impresso' as OrderStatus, printCount: o.printCount + 1, updatedAt: new Date().toISOString() }
              : o,
          ),
        })),
      markPrintError: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: 'erro_impressao' as OrderStatus, updatedAt: new Date().toISOString() } : o,
          ),
        })),
      markConcluded: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: 'concluido' as OrderStatus, updatedAt: new Date().toISOString() } : o,
          ),
        })),
      cancelOrder: (id, reason) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? { ...o, status: 'cancelado' as OrderStatus, cancelReason: reason, updatedAt: new Date().toISOString() }
              : o,
          ),
        })),
      registerReprint: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  printCount: o.printCount + 1,
                  status: o.status === 'erro_impressao' ? ('impresso' as OrderStatus) : o.status,
                  updatedAt: new Date().toISOString(),
                }
              : o,
          ),
        })),
    }),
    { name: 'forno-orders' },
  ),
)
