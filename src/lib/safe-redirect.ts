const ALLOWED_NEXT_PATHS = ['/donate/confirm', '/donate/payment', '/profile/complete'] as const

export function getSafeNextPath(next: string | null | undefined): string | null {
  if (!next) return null
  if (!next.startsWith('/')) return null
  if (next.includes('://') || next.startsWith('//')) return null

  const isAllowed = ALLOWED_NEXT_PATHS.some(
    (path) => next === path || next.startsWith(`${path}?`) || next.startsWith(`${path}/`),
  )

  return isAllowed ? next.split('?')[0] : null
}

export function appendNextParam(path: string, next: string | null): string {
  if (!next) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}next=${encodeURIComponent(next)}`
}
