'use server'

import { redirect } from 'next/navigation'

import { clearDonorTokenCookie } from '@/lib/auth-cookie'

export async function logout(): Promise<void> {
  await clearDonorTokenCookie()
  redirect('/auth')
}
