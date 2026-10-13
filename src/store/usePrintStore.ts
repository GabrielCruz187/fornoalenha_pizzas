import { create } from 'zustand'
import type { Order } from '../types'
import type { CashClosingData } from '../lib/dashboardStats'

export type PrintJob =
  | { type: 'receipt'; order: Order }
  | { type: 'cashClosing'; data: CashClosingData }

interface PrintState {
  /** Order whose kitchen ticket is being previewed (before printing). */
  preview: Order | null
  job: PrintJob | null
  /** Opens the preview; printing only starts after confirmPrint. */
  requestPrint: (order: Order) => void
  confirmPrint: () => void
  closePreview: () => void
  requestCashClosingPrint: (data: CashClosingData) => void
  clear: () => void
}

export const usePrintStore = create<PrintState>((set, get) => ({
  preview: null,
  job: null,
  requestPrint: (order) => set({ preview: order }),
  confirmPrint: () => {
    const { preview } = get()
    if (preview) set({ preview: null, job: { type: 'receipt', order: preview } })
  },
  closePreview: () => set({ preview: null }),
  requestCashClosingPrint: (data) => set({ job: { type: 'cashClosing', data } }),
  clear: () => set({ job: null }),
}))
