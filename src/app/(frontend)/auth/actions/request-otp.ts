'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

import { setDonorTokenCookie } from '@/lib/auth-cookie'
import {
  checkCanRequestOtp,
  generateOtpCode,
  generateRandomPassword,
  storeOtp,
  verifyOtpCode,
} from '@/lib/otp-security'
import { sendOtpSms } from '@/lib/sms'
import { normalizeIranMobile, validateIranMobile } from '@/lib/validators'
import { donorNeedsProfile } from '@/lib/profile'

export type ActionResult = {
  success: boolean
  error?: string
  needsProfile?: boolean
}

export async function requestOtp(phoneInput: string): Promise<ActionResult> {
  const phone = normalizeIranMobile(phoneInput)

  if (!validateIranMobile(phone)) {
    return { success: false, error: 'لطفاً شماره موبایل معتبر وارد کنید.' }
  }

  const rateCheck = checkCanRequestOtp(phone)
  if (!rateCheck.ok) {
    return { success: false, error: rateCheck.error }
  }

  try {
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'donors',
      where: { username: { equals: phone } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'donors',
        data: {
          username: phone,
          password: generateRandomPassword(),
        },
      })
    }

    const code = generateOtpCode()

    try {
      await sendOtpSms(phone, code)
    } catch (smsErr) {
      console.error('sendOtpSms error:', smsErr)
      const message =
        smsErr instanceof Error ? smsErr.message : 'خطا در ارسال پیامک. دوباره تلاش کنید.'
      return { success: false, error: message }
    }

    storeOtp(phone, code)

    return { success: true }
  } catch (err) {
    console.error('requestOtp error:', err)
    return { success: false, error: 'خطایی رخ داد. دوباره تلاش کنید.' }
  }
}

export async function verifyOtp(phoneInput: string, code: string): Promise<ActionResult> {
  const phone = normalizeIranMobile(phoneInput)

  if (!validateIranMobile(phone)) {
    return { success: false, error: 'شماره موبایل نامعتبر است.' }
  }

  if (!/^\d{6}$/.test(code)) {
    return { success: false, error: 'کد باید ۶ رقمی باشد.' }
  }

  const verifyResult = verifyOtpCode(phone, code)
  if (!verifyResult.ok) {
    return { success: false, error: verifyResult.error }
  }

  try {
    const payload = await getPayload({ config })

    const donorResult = await payload.find({
      collection: 'donors',
      where: { username: { equals: phone } },
      limit: 1,
    })

    if (donorResult.docs.length === 0) {
      return { success: false, error: 'کاربر یافت نشد.' }
    }

    const donor = donorResult.docs[0]
    const tempPassword = generateRandomPassword()

    await payload.update({
      collection: 'donors',
      id: donor.id,
      data: { password: tempPassword },
    })

    const loginResult = await payload.login({
      collection: 'donors',
      data: {
        username: phone,
        password: tempPassword,
      },
    })

    if (!loginResult.token) {
      return { success: false, error: 'ورود ناموفق بود.' }
    }

    await setDonorTokenCookie(loginResult.token)
    return {
      success: true,
      needsProfile: donorNeedsProfile(donor),
    }
  } catch (err) {
    console.error('verifyOtp error:', err)
    return { success: false, error: 'خطایی رخ داد. دوباره تلاش کنید.' }
  }
}
