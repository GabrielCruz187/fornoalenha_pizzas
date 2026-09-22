import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { TextAreaField } from './FormControls'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason?: string) => void
  title: string
  description: string
  confirmLabel?: string
  danger?: boolean
  askReason?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  danger = true,
  askReason = false,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Voltar
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm(reason.trim() || undefined)
              setReason('')
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {askReason && (
        <TextAreaField
          label="Motivo (opcional)"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: cliente desistiu, endereço errado..."
        />
      )}
    </Modal>
  )
}
