const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

export function normalizeDigits(value: string): string {
  return value
    .split('')
    .map((char) => {
      const persianIndex = PERSIAN_DIGITS.indexOf(char)
      if (persianIndex >= 0) return String(persianIndex)

      const arabicIndex = ARABIC_DIGITS.indexOf(char)
      if (arabicIndex >= 0) return String(arabicIndex)

      return char
    })
    .join('')
    .replace(/[^\d]/g, '')
}

export function formatTomans(amount: number): string {
  return `${amount.toLocaleString('fa-IR')} تومان`
}

export function parseAmountInput(value: string): number | null {
  const digits = normalizeDigits(value)
  if (!digits) return null
  const amount = Number(digits)
  if (!Number.isFinite(amount) || amount <= 0) return null
  return amount
}
