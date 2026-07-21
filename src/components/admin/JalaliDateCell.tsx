'use client'

import type { DefaultCellComponentProps } from 'payload'

import { formatJalaliDateTime } from '@/lib/jalali-date'

export function JalaliDateCell({ cellData }: DefaultCellComponentProps) {
  if (!cellData) return <span>—</span>

  return <span>{formatJalaliDateTime(String(cellData))}</span>
}
