import { type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '../../lib/cn'

const fieldBase =
  'w-full rounded-lg border border-border bg-bg-soft px-3 py-2.5 text-sm text-cream placeholder:text-muted-dim ' +
  'transition-colors focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/40'

interface FieldWrapperProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  children: (id: string) => ReactNode
  className?: string
}

function FieldWrapper({ label, hint, error, required, children, className }: FieldWrapperProps) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-cream-dim">
          {label}
          {required && <span className="text-ember-400"> *</span>}
        </label>
      )}
      {children(id)}
      {error ? (
        <span className="text-xs text-status-error">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </div>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, error, required, className, ...props }, ref) => (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      {(id) => (
        <input
          id={id}
          ref={ref}
          className={cn(fieldBase, error && 'border-status-error/60', className)}
          {...props}
        />
      )}
    </FieldWrapper>
  ),
)
TextField.displayName = 'TextField'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, hint, className, ...props }, ref) => (
    <FieldWrapper label={label} hint={hint}>
      {(id) => (
        <textarea id={id} ref={ref} className={cn(fieldBase, 'resize-none', className)} {...props} />
      )}
    </FieldWrapper>
  ),
)
TextAreaField.displayName = 'TextAreaField'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  children: ReactNode
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, hint, className, children, ...props }, ref) => (
    <FieldWrapper label={label} hint={hint}>
      {(id) => (
        <select id={id} ref={ref} className={cn(fieldBase, 'cursor-pointer', className)} {...props}>
          {children}
        </select>
      )}
    </FieldWrapper>
  ),
)
SelectField.displayName = 'SelectField'
