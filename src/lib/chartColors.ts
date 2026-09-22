import type { PaymentMethod } from '../types'

// Validated against the app's dark surface (#1e1815) with scripts/validate_palette.js
// from the dataviz skill — adjacent-pair safe for bar/line use.
export const CATEGORICAL = {
  blue: '#3987e5',
  orange: '#d95926',
  aqua: '#199e70',
  yellow: '#c98500',
} as const

export const PAYMENT_COLORS: Record<PaymentMethod, string> = {
  dinheiro: CATEGORICAL.blue,
  cartao_credito: CATEGORICAL.orange,
  pix: CATEGORICAL.aqua,
  cartao_debito: CATEGORICAL.yellow,
}

export const SEQUENTIAL_HUE = CATEGORICAL.blue

export const CHART_INK = {
  secondary: '#a3927c',
  grid: '#33291f',
  surface: '#1e1815',
}
