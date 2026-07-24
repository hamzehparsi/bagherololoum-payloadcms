'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { revalidatePath } from 'next/cache'

import { getDonorTokenFromCookies } from '@/lib/auth-cookie'
import { AVATAR_PRESETS, type AvatarPreset } from '@/lib/media'

export type AvatarUploadResult = {
  success: boolean
  error?: string
}

const MAX_BYTES = 3 * 1024 * 1024 // 3MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function updateAvatar(formData: FormData): Promise<AvatarUploadResult> {
  const token = await getDonorTokenFromCookies()
  if (!token) {
    return { success: false, error: 'لطفاً ابتدا وارد شوید.' }
  }

  const file = formData.get('avatar')
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'لطفاً یک تصویر انتخاب کنید.' }
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { success: false, error: 'فقط تصاویر JPG، PNG، WEBP یا GIF مجاز است.' }
  }

  if (file.size > MAX_BYTES) {
    return { success: false, error: 'حجم تصویر نباید بیشتر از ۳ مگابایت باشد.' }
  }

  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({
      headers: new Headers({ Authorization: `JWT ${token}` }),
    })

    if (!user || user.collection !== 'donors') {
      return { success: false, error: 'دسترسی غیرمجاز.' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: `تصویر پروفایل ${user.username || user.id}`,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name || `avatar-${user.id}.jpg`,
        size: file.size,
      },
      overrideAccess: false,
      user,
    })

    await payload.update({
      collection: 'donors',
      id: user.id,
      data: {
        avatar: media.id,
      },
      overrideAccess: false,
      user,
    })

    revalidatePath('/')
    revalidatePath('/profile')

    return { success: true }
  } catch (err) {
    console.error('updateAvatar error:', err)
    return { success: false, error: 'بارگذاری تصویر ناموفق بود. دوباره تلاش کنید.' }
  }
}

export async function updateAvatarPreset(preset: string): Promise<AvatarUploadResult> {
  const token = await getDonorTokenFromCookies()
  if (!token) {
    return { success: false, error: 'لطفاً ابتدا وارد شوید.' }
  }

  if (!AVATAR_PRESETS.includes(preset as AvatarPreset)) {
    return { success: false, error: 'قالب انتخابی معتبر نیست.' }
  }

  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({
      headers: new Headers({ Authorization: `JWT ${token}` }),
    })

    if (!user || user.collection !== 'donors') {
      return { success: false, error: 'دسترسی غیرمجاز.' }
    }

    // Clear the custom avatar so the chosen gradient becomes visible
    await payload.update({
      collection: 'donors',
      id: user.id,
      data: {
        avatar: null,
        avatarPreset: preset as AvatarPreset,
      },
      overrideAccess: false,
      user,
    })

    revalidatePath('/')
    revalidatePath('/profile')

    return { success: true }
  } catch (err) {
    console.error('updateAvatarPreset error:', err)
    return { success: false, error: 'ذخیره قالب رنگی ناموفق بود. دوباره تلاش کنید.' }
  }
}
