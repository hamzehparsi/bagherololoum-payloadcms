'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import type { Donor } from '@/payload-types'

import { getDonorTokenFromCookies } from '@/lib/auth-cookie'

export async function getSession(): Promise<Donor | null> {
  const token = await getDonorTokenFromCookies()
  if (!token) return null

  const payload = await getPayload({ config })

  try {
    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`,
      }),
    })

    if (user?.collection !== 'donors') return null

    // Populate avatar relation for header / profile UI
    return (await payload.findByID({
      collection: 'donors',
      id: user.id,
      depth: 1,
      overrideAccess: false,
      user,
    })) as Donor
  } catch (err) {
    console.error('getSession error:', err)
    return null
  }
}
