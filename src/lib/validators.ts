const IRAN_MOBILE_REGEX = /^09\d{9}$/

export function normalizeIranMobile(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('09')) return digits
  if (digits.length === 10 && digits.startsWith('9')) return `0${digits}`
  return input.trim()
}

export function validateIranMobile(phone: string): boolean {
  return IRAN_MOBILE_REGEX.test(normalizeIranMobile(phone))
}
