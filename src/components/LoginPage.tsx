import type { ChangeEvent, FormEvent, FocusEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { login, LoginError } from '../api/loginApi'
import { validateEmail, validatePassword } from '../validators'
import { Button } from './Button'
import { Field, type FieldState } from './Field'

type FieldName = 'email' | 'password'
type FieldErrors = Partial<Record<FieldName, string>>

const helperTextId = 'signin-helper'

const LoginPage = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    email: false,
    password: false,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [focusedField, setFocusedField] = useState<FieldName | null>(null)
  const [typingField, setTypingField] = useState<FieldName | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    'idle',
  )
  const [serverError, setServerError] = useState<LoginError | null>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  useEffect(() => {
    emailRef.current?.focus()

    return () => {
      if (typingTimeout.current !== null) {
        window.clearTimeout(typingTimeout.current)
      }
    }
  }, [])

  const isSubmitting = status === 'submitting'
  const isSuccess = status === 'success'
  const formDisabled = isSubmitting || isSuccess

  const scheduleTypingReset = (field: FieldName) => {
    if (typingTimeout.current !== null) {
      window.clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = window.setTimeout(() => {
      setTypingField((current) => (current === field ? null : current))
    }, 600)
  }

  const updateFieldValue =
    (field: FieldName) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
      setServerError(null)
      setTypingField(field)
      scheduleTypingReset(field)
    }

  const handleFocus = (field: FieldName) => () => {
    setFocusedField(field)
    setTypingField(null)
  }

  const setFieldError = (field: FieldName, message?: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      if (message) {
        next[field] = message
      } else {
        delete next[field]
      }
      return next
    })
  }

  const handleBlur =
    (field: FieldName) => (event: FocusEvent<HTMLInputElement>) => {
      const value = event.target.value
      const message =
        field === 'email' ? validateEmail(value) : validatePassword(value)
      setFocusedField((current) => (current === field ? null : current))
      setTypingField((current) => (current === field ? null : current))
      setTouched((prev) => ({ ...prev, [field]: true }))
      setFieldError(field, message)
    }

  const focusFirstInvalidField = (fieldErrors: FieldErrors) => {
    if (fieldErrors.email) {
      emailRef.current?.focus()
      return true
    }

    if (fieldErrors.password) {
      passwordRef.current?.focus()
      return true
    }

    return false
  }

  const validateBeforeSubmit = () => {
    const emailError = validateEmail(values.email)
    const passwordError = validatePassword(values.password)
    const nextErrors: FieldErrors = {}

    if (emailError) {
      nextErrors.email = emailError
    }

    if (passwordError) {
      nextErrors.password = passwordError
    }

    setErrors(nextErrors)
    setTouched({ email: true, password: true })
    return nextErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError(null)
    const validationErrors = validateBeforeSubmit()

    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalidField(validationErrors)
      return
    }

    setStatus('submitting')

    try {
      await login(values)
      setStatus('success')
    } catch (error) {
      const fallback = new LoginError(
        'network',
        'You appear to be offline. Check your connection and try again.',
      )
      const resolvedError = error instanceof LoginError ? error : fallback
      setServerError(resolvedError)
      setStatus('idle')
      setTimeout(() => {
        errorSummaryRef.current?.focus()
      }, 0)
    }
  }

  const getFieldState = (field: FieldName): FieldState => {
    if (errors[field]) {
      return 'invalid'
    }

    if (typingField === field && focusedField === field) {
      return 'typing'
    }

    if (focusedField === field) {
      return 'focused'
    }

    if (touched[field]) {
      return 'valid'
    }

    return 'idle'
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }

  return (
    <div className="page">
      <main className="panel" aria-live="polite">
        <header className="panel__header">
          <h1>Sign in</h1>
          <p id={helperTextId}>Use your work email to continue.</p>
        </header>

        {serverError ? (
          <div
            ref={errorSummaryRef}
            className="alert"
            role="alert"
            tabIndex={-1}
          >
            {serverError.message}
          </div>
        ) : null}

        {isSuccess ? (
          <div className="success" role="status" aria-live="polite">
            <p>Signed in successfully.</p>
            <p className="success__meta">Redirecting...</p>
          </div>
        ) : null}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <fieldset className="form__fields" disabled={formDisabled}>
            <Field
              id="email"
              name="email"
              label="Email"
              type="email"
              value={values.email}
              placeholder="name@company.com"
              autoComplete="email"
              inputMode="email"
              required
              describedBy={helperTextId}
              error={errors.email}
              state={getFieldState('email')}
              inputRef={emailRef}
              onChange={updateFieldValue('email')}
              onBlur={handleBlur('email')}
              onFocus={handleFocus('email')}
              disabled={formDisabled}
            />

            <Field
              id="password"
              name="password"
              label="Password"
              type={passwordVisible ? 'text' : 'password'}
              value={values.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              error={errors.password}
              state={getFieldState('password')}
              inputRef={passwordRef}
              onChange={updateFieldValue('password')}
              onBlur={handleBlur('password')}
              onFocus={handleFocus('password')}
              disabled={formDisabled}
            >
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                aria-pressed={passwordVisible}
                disabled={formDisabled}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </Field>
          </fieldset>

          <Button
            type="submit"
            loading={isSubmitting}
            loadingText="Signing in..."
            disabled={formDisabled}
          >
            Sign in
          </Button>
        </form>

        <footer className="panel__footer">
          <a href="#" className="panel__link">
            Forgot password?
          </a>
          <span aria-hidden="true" className="panel__separator">
            |
          </span>
          <a href="#" className="panel__link">
            Create account
          </a>
        </footer>
      </main>
    </div>
  )
}

export default LoginPage
