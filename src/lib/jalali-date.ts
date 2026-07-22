export function formatJalaliDate(
  value: string | Date | null | undefined,
  options?: { withTime?: boolean },
): string {
  if (!value) return '—'

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('fa-IR', {
    calendar: 'persian',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(options?.withTime
      ? {
          hour: '2-digit',
          minute: '2-digit',
        }
      : {}),
  }).format(date)
}

export function formatJalaliDateTime(value: string | Date | null | undefined): string {
  return formatJalaliDate(value, { withTime: true })
}

export function buildDateRangeLabel(
  startDate?: string | Date | null,
  endDate?: string | Date | null,
): string | null {
  const start = startDate ? formatJalaliDate(startDate) : null
  const end = endDate ? formatJalaliDate(endDate) : null

  if (start && end) return `${start} تا ${end}`
  if (start) return `از ${start}`
  if (end) return `تا ${end}`
  return null
}
