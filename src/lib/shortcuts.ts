export interface ShortcutInfo {
  keys: string[]
  label: string
}

export const SHORTCUTS: ShortcutInfo[] = [
  { keys: ['Alt', '1'], label: 'Novo Pedido' },
  { keys: ['Alt', '2'], label: 'Pedidos' },
  { keys: ['Alt', '3'], label: 'Cardápio' },
  { keys: ['Alt', '4'], label: 'Dashboard' },
  { keys: ['Alt', '5'], label: 'Fechamento de Caixa' },
  { keys: ['/'], label: 'Buscar item no cardápio (Novo Pedido)' },
  { keys: ['Enter'], label: 'Na busca: adicionar o primeiro resultado' },
  { keys: ['Esc'], label: 'Na busca: limpar · Fecha janelas' },
  { keys: ['Ctrl', 'Enter'], label: 'Confirmar pedido / Imprimir na prévia' },
  { keys: ['?'], label: 'Mostrar esta lista de atalhos' },
]

export const NAV_SHORTCUT_ROUTES = ['/', '/pedidos', '/cardapio', '/dashboard', '/caixa']

/** True when the key press happened while the user is typing in a field. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}
