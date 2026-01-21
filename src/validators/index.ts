export type FieldError = string | undefined

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateEmail = (value: string): FieldError => {
  if (!value.trim()) {
    return 'Enter a valid email address.'
  }

  if (!emailPattern.test(value.trim())) {
    return 'Enter a valid email address.'
  }

  return undefined
}

export const validatePassword = (value: string): FieldError => {
  if (!value) {
    return 'Password must be at least 8 characters.'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  return undefined
}
