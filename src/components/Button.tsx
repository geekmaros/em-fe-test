import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  loadingText?: string
  children: ReactNode
}

const Button = ({
  loading = false,
  loadingText = 'Loading...',
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className="button"
      disabled={disabled || loading}
      data-loading={loading ? 'true' : 'false'}
      aria-live="polite"
      {...rest}
    >
      {loading ? (
        <span className="button__content">
          <span className="button__spinner" aria-hidden="true" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export { Button }
