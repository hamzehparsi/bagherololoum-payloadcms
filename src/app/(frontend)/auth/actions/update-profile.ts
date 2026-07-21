'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

import { getDonorTokenFromCookies } from '@/lib/auth-cookie'

export type ProfileResult = {
  success: boolean
  error?: string
}

export async function updateProfile(
  firstName: string,
  lastName: string,
): Promise<ProfileResult> {
  const token = await getDonorTokenFromCookies()
  if (!token) {
    return { success: false, error: 'لطفاً ابتدا وارد شوید.' }
  }

  const trimmedFirst = firstName.trim()
  const trimmedLast = lastName.trim()

  if (!trimmedFirst || !trimmedLast) {
    return { success: false, error: 'نام و نام خانوادگی الزامی است.' }
  }

  if (trimmedFirst.length < 2 || trimmedLast.length < 2) {
    return { success: false, error: 'نام و نام خانوادگی باید حداقل ۲ حرف باشد.' }
  }

  try {
    const payload = await getPayload({ config })

    const { user } = await payload.auth({
      headers: new Headers({ Authorization: `JWT ${token}` }),
    })

    if (!user || user.collection !== 'donors') {
      return { success: false, error: 'دسترسی غیرمجاز.' }
    }

    await payload.update({
      collection: 'donors',
      id: user.id,
      data: {
        firstName: trimmedFirst,
        lastName: trimmedLast,
      },
    })

    return { success: true }
  } catch (err) {
    console.error('updateProfile error:', err)
    return { success: false, error: 'خطایی رخ داد. دوباره تلاش کنید.' }
  }
}

export async function updateProfileAndRedirect(
  firstName: string,
  lastName: string,
): Promise<ProfileResult> {
  const result = await updateProfile(firstName, lastName)
  if (result.success) redirect('/')
  return result
}
