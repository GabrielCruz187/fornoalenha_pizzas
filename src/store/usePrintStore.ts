import { create } from 'zustand'
import type { Order } from '../types'
import type { CashClosingData } from '../lib/dashboardStats'

export type PrintJob =
  | { type: 'receipt'; order: Order }
  | { type: 'cashClosing'; data: CashClosingData }

interface PrintState {
  job: PrintJob | null
  requestPrint: (order: Order) => void
  requestCashClosingPrint: (data: CashClosingData) => void
  clear: () => void
}

export const usePrintStore = create<PrintState>((set) => ({
  job: null,
  requestPrint: (order) => set({ job: { type: 'receipt', order } }),
  requestCashClosingPrint: (data) => set({ job: { type: 'cashClosing', data } }),
  clear: () => set({ job: null }),
}))
