import type { Donor } from '@/payload-types'

export function donorNeedsProfile(donor: Pick<Donor, 'firstName' | 'lastName'>): boolean {
  return !donor.firstName?.trim() || !donor.lastName?.trim()
}

export function getDonorDisplayName(donor: Pick<Donor, 'firstName' | 'lastName' | 'username'>): string {
  const first = donor.firstName?.trim()
  const last = donor.lastName?.trim()
  if (first && last) return `${first} ${last}`
  if (first) return first
  if (last) return last
  return 'کاربر'
}
