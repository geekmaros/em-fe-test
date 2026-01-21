import type {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  ReactNode,
  Ref,
} from 'react'

type FieldState = 'idle' | 'focused' | 'typing' | 'valid' | 'invalid'

type FieldProps = {
  id: string
  name: string
  label: string
  type?: HTMLInputTypeAttribute
  value: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  error?: string
  describedBy?: string
  state: FieldState
  disabled?: boolean
  children?: ReactNode
  inputRef?: Ref<HTMLInputElement>
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur: FocusEventHandler<HTMLInputElement>
  onFocus: FocusEventHandler<HTMLInputElement>
}

const Field = ({
  id,
  name,
  label,
  type = 'text',
  value,
  placeholder,
  autoComplete,
  inputMode,
  required,
  error,
  describedBy,
  state,
  disabled,
  children,
  inputRef,
  onChange,
  onBlur,
  onFocus,
}: FieldProps) => {
  const errorId = error ? `${id}-error` : undefined
  const describedByAttr =
    [describedBy, errorId].filter((value): value is string => Boolean(value))
      .join(' ') || undefined

  const controlClass = children
    ? 'field__control field__control--with-action'
    : 'field__control'

  return (
    <div className="field" data-state={state}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className={controlClass}>
        <input
          ref={inputRef}
          className="field__input"
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedByAttr}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        {children}
      </div>
      <p
        aria-live="polite"
        id={errorId}
        className="field__message"
        role={error ? 'alert' : undefined}
      >
        {error ?? ''}
      </p>
    </div>
  )
}

export type { FieldState }
export { Field }
