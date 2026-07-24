import type { CollectionBeforeOperationHook } from 'payload'

import { expandDateEqualsInWhere } from '@/lib/expand-date-day-equals'

/**
 * Makes admin date "equals" filters match the whole Tehran calendar day
 * instead of a single pinned timestamp.
 */
export const expandDateDayEquals: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (operation !== 'read' && operation !== 'count') return args
  if (!args || typeof args !== 'object' || !('where' in args) || !args.where) return args

  return {
    ...args,
    where: expandDateEqualsInWhere(args.where),
  }
}
