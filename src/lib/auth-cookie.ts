import { cookies } from 'next/headers'

export const DONOR_TOKEN_COOKIE = 'donor-token'

export const donorTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

export async function setDonorTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(DONOR_TOKEN_COOKIE, token, donorTokenCookieOptions)
}

export async function clearDonorTokenCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(DONOR_TOKEN_COOKIE)
}

export async function getDonorTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(DONOR_TOKEN_COOKIE)?.value
}
