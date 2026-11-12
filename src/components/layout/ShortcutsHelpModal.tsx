import { Modal } from '../ui/Modal'
import { SHORTCUTS } from '../../lib/shortcuts'

export function ShortcutsHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Atalhos de teclado" description="Agilize o balcão sem usar o mouse.">
      <ul className="flex flex-col divide-y divide-border">
        {SHORTCUTS.map(({ keys, label }) => (
          <li key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <span className="text-cream-dim">{label}</span>
            <span className="flex shrink-0 items-center gap-1">
              {keys.map((k) => (
                <kbd
                  key={k}
                  className="rounded-md border border-border-strong bg-surface-raised px-2 py-0.5 font-mono text-xs text-cream"
                >
                  {k}
                </kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
