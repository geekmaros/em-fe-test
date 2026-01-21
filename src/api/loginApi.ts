const VALID_EMAIL = 'abdulrasaq@evilmartians.com'
const VALID_PASSWORD = 'password123'

export type LoginScenario = 'success' | 'invalid' | 'rate' | 'network'

export type LoginResult = {
  success: true
}

export type LoginCredentials = {
  email: string
  password: string
}

export class LoginError extends Error {
  public code: Exclude<LoginScenario, 'success'>

  constructor(code: Exclude<LoginScenario, 'success'>, message: string) {
    super(message)
    this.name = 'LoginError'
    this.code = code
  }
}

const MIN_DELAY = 900
const MAX_DELAY = 1400

const scenarioMessages: Record<Exclude<LoginScenario, 'success'>, string> = {
  invalid: 'Email or password is incorrect.',
  rate: 'Too many attempts. Try again in a few minutes.',
  network: 'You appear to be offline. Check your connection and try again.',
}

const scenarioParamMap: Record<string, LoginScenario> = {
  success: 'success',
  invalid: 'invalid',
  rate: 'rate',
  network: 'network',
}

const randomOutcomes: LoginScenario[] = [
  'success',
  'success',
  'success',
  'invalid',
  'rate',
  'network',
]

const getScenarioFromSearch = () => {
  const params = new URLSearchParams(window.location.search)
  const paramScenario = params.get('scenario')

  if (!paramScenario) {
    return null
  }

  return scenarioParamMap[paramScenario] ?? null
}

const pickRandomScenario = () => {
  const index = Math.floor(Math.random() * randomOutcomes.length)
  return randomOutcomes[index]
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const login = async ({
  email,
  password,
}: LoginCredentials): Promise<LoginResult> => {
  const delay =
    Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY

  const forcedScenario = getScenarioFromSearch()
  const scenario = forcedScenario ?? pickRandomScenario()

  await wait(delay)

  if (scenario === 'network') {
    throw new LoginError('network', scenarioMessages.network)
  }

  if (scenario === 'rate') {
    throw new LoginError('rate', scenarioMessages.rate)
  }

  const credentialsMatch =
    email.trim().toLowerCase() === VALID_EMAIL &&
    password === VALID_PASSWORD

  if (scenario === 'success' && credentialsMatch) {
    return { success: true }
  }

  throw new LoginError('invalid', scenarioMessages.invalid)
}
