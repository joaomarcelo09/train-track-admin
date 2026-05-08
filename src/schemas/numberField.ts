import { z } from 'zod'

export function numberField(message: string) {
  return z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value
    }

    const normalizedValue = value.trim().replace(',', '.')

    if (normalizedValue === '') {
      return undefined
    }

    return Number(normalizedValue)
  }, z.number({ error: message }).finite(message))
}
