import type { Where, WhereField } from 'payload'

const DATE_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'deletedAt',
  'startDate',
  'endDate',
  'publishedAt',
])

const IRAN_OFFSET_MS = 3.5 * 60 * 60 * 1000

function isIsoDateValue(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

/** Calendar day bounds in Asia/Tehran for a given instant. */
export function getIranDayBounds(iso: string): { gte: string; lt: string } {
  const date = new Date(iso)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )

  const year = Number(parts.year)
  const month = Number(parts.month)
  const day = Number(parts.day)

  // Midnight Tehran on that calendar day = UTC midnight of that Y-M-D minus 3.5h
  const startMs = Date.UTC(year, month - 1, day) - IRAN_OFFSET_MS
  const endMs = startMs + 24 * 60 * 60 * 1000

  return {
    gte: new Date(startMs).toISOString(),
    lt: new Date(endMs).toISOString(),
  }
}

function expandEqualsConstraint(constraint: WhereField): WhereField {
  if (!constraint || typeof constraint !== 'object' || Array.isArray(constraint)) {
    return constraint
  }

  if (!('equals' in constraint) || !isIsoDateValue(constraint.equals)) {
    return constraint
  }

  const { gte, lt } = getIranDayBounds(constraint.equals)
  const { equals: _equals, ...rest } = constraint

  return {
    ...rest,
    greater_than_equal: gte,
    less_than: lt,
  }
}

/**
 * Rewrites date `equals` filters into a full Tehran calendar-day range.
 * Payload's date picker pins a specific time-of-day, so exact equality almost never matches real timestamps.
 */
export function expandDateEqualsInWhere(where: Where): Where {
  if (!where || typeof where !== 'object') return where

  if (Array.isArray(where.and)) {
    return {
      ...where,
      and: where.and.map((item) => expandDateEqualsInWhere(item)),
    }
  }

  if (Array.isArray(where.or)) {
    return {
      ...where,
      or: where.or.map((item) => expandDateEqualsInWhere(item)),
    }
  }

  const next: Where = { ...where }

  for (const [key, value] of Object.entries(where)) {
    if (key === 'and' || key === 'or') continue

    if (DATE_FIELDS.has(key) && value && typeof value === 'object' && !Array.isArray(value)) {
      next[key] = expandEqualsConstraint(value as WhereField)
    }
  }

  return next
}
