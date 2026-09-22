import { useThemeStore } from '../store/useThemeStore'
import type { PaymentMethod } from '../types'

// Validated with scripts/validate_palette.js (dataviz skill) against this
// app's actual surfaces — dark #1e1815 (adjacent-pair safe) and light #fffcf5
// (all-pairs WARN on 2 slots below 3:1 contrast; mitigated by the direct
// value + axis labels every chart already ships).
const DARK = {
  categorical: { blue: '#3987e5', orange: '#d95926', aqua: '#199e70', yellow: '#c98500' },
  tooltipBg: '#261f1a',
  tooltipBorder: '#382e25',
  tooltipText: '#f5ecd9',
  labelText: '#d9cbb2',
  axisText: '#a3927c',
  grid: '#33291f',
  cursorFill: 'rgba(255,255,255,0.04)',
}

const LIGHT = {
  categorical: { blue: '#2a78d6', orange: '#eb6834', aqua: '#1baf7a', yellow: '#eda100' },
  tooltipBg: '#fffcf5',
  tooltipBorder: '#e4d7b8',
  tooltipText: '#241c14',
  labelText: '#4a3c2c',
  axisText: '#6b5d4a',
  grid: '#e8ddc4',
  cursorFill: 'rgba(36,28,20,0.05)',
}

function paletteFor(theme: 'dark' | 'light') {
  return theme === 'light' ? LIGHT : DARK
}

export function useChartPalette() {
  const theme = useThemeStore((s) => s.theme)
  const palette = paletteFor(theme)
  const paymentColors: Record<PaymentMethod, string> = {
    dinheiro: palette.categorical.blue,
    cartao_credito: palette.categorical.orange,
    pix: palette.categorical.aqua,
    cartao_debito: palette.categorical.yellow,
  }
  return {
    paymentColors,
    sequentialHue: palette.categorical.blue,
    tooltipStyle: {
      background: palette.tooltipBg,
      border: `1px solid ${palette.tooltipBorder}`,
      borderRadius: 8,
      fontSize: 12,
      color: palette.tooltipText,
    },
    labelStyle: { fill: palette.labelText, fontSize: 12, fontWeight: 500 },
    axisTick: { fill: palette.axisText, fontSize: 12 },
    axisTickSmall: { fill: palette.axisText, fontSize: 11 },
    grid: palette.grid,
    cursorFill: palette.cursorFill,
  }
}
