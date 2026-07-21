import crypto from 'crypto'

import {
  clearOtpKeys,
  getOtpRecord,
  isBlocked,
  isRateLimited,
  setBlock,
  setOtpRecord,
  setRateLimit,
} from './otp-cache'
import { MAX_OTP_ATTEMPTS } from './otp-constants'

export { MAX_OTP_ATTEMPTS } from './otp-constants'

function getSecret(): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not configured')
  return secret
}

export function hashOtp(phone: string, code: string): string {
  return crypto.createHmac('sha256', getSecret()).update(`${phone}:${code}`).digest('hex')
}

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString()
}

export function generateRandomPassword(): string {
  return crypto.randomUUID() + '!A1'
}

export type RequestOtpCheckResult =
  | { ok: true }
  | { ok: false; error: string; status: 'blocked' | 'rate_limited' }

export function checkCanRequestOtp(phone: string): RequestOtpCheckResult {
  if (isBlocked(phone)) {
    return {
      ok: false,
      status: 'blocked',
      error: 'به دلیل تلاش‌های ناموفق، این شماره به مدت ۱ ساعت مسدود شده است.',
    }
  }

  if (isRateLimited(phone)) {
    return {
      ok: false,
      status: 'rate_limited',
      error: 'لطفاً ۲ دقیقه صبر کنید و دوباره درخواست دهید.',
    }
  }

  return { ok: true }
}

export function storeOtp(phone: string, code: string): void {
  setOtpRecord(phone, { hashedOtp: hashOtp(phone, code), attempts: 0 })
  setRateLimit(phone)
}

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; error: string; blocked?: boolean }

export function verifyOtpCode(phone: string, code: string): VerifyOtpResult {
  if (isBlocked(phone)) {
    return {
      ok: false,
      blocked: true,
      error: 'به دلیل تلاش‌های ناموفق، این شماره به مدت ۱ ساعت مسدود شده است.',
    }
  }

  const record = getOtpRecord(phone)
  if (!record) {
    return { ok: false, error: 'کد منقضی شده یا ارسال نشده است.' }
  }

  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    setBlock(phone)
    clearOtpKeys(phone)
    return {
      ok: false,
      blocked: true,
      error: 'تعداد دفعات اشتباه بیش از حد مجاز است. این شماره به مدت ۱ ساعت مسدود شد.',
    }
  }

  const hashedInput = hashOtp(phone, code)
  if (record.hashedOtp !== hashedInput) {
    const attempts = record.attempts + 1
    if (attempts >= MAX_OTP_ATTEMPTS) {
      setBlock(phone)
      clearOtpKeys(phone)
      return {
        ok: false,
        blocked: true,
        error: 'تعداد دفعات اشتباه بیش از حد مجاز است. این شماره به مدت ۱ ساعت مسدود شد.',
      }
    }

    setOtpRecord(phone, { ...record, attempts })
    return {
      ok: false,
      error: `کد اشتباه است. ${MAX_OTP_ATTEMPTS - attempts} فرصت باقی مانده.`,
    }
  }

  clearOtpKeys(phone)
  return { ok: true }
}
