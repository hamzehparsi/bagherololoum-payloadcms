import NodeCache from 'node-cache'

import {
  BLOCK_TTL_SECONDS,
  OTP_TTL_SECONDS,
  RATE_LIMIT_TTL_SECONDS,
} from './otp-constants'

export { OTP_TTL_SECONDS, RATE_LIMIT_TTL_SECONDS, BLOCK_TTL_SECONDS } from './otp-constants'

export type OtpRecord = {
  hashedOtp: string
  attempts: number
}

const cache = new NodeCache({ checkperiod: 60 })

export function otpKey(phone: string): string {
  return `otp:${phone}`
}

export function rateKey(phone: string): string {
  return `rate:${phone}`
}

export function blockKey(phone: string): string {
  return `block:${phone}`
}

export function isBlocked(phone: string): boolean {
  return cache.has(blockKey(phone))
}

export function setBlock(phone: string): void {
  cache.set(blockKey(phone), true, BLOCK_TTL_SECONDS)
}

export function isRateLimited(phone: string): boolean {
  return cache.has(rateKey(phone))
}

export function setRateLimit(phone: string): void {
  cache.set(rateKey(phone), true, RATE_LIMIT_TTL_SECONDS)
}

export function getOtpRecord(phone: string): OtpRecord | undefined {
  return cache.get<OtpRecord>(otpKey(phone))
}

export function setOtpRecord(phone: string, record: OtpRecord): void {
  cache.set(otpKey(phone), record, OTP_TTL_SECONDS)
}

export function clearOtpKeys(phone: string): void {
  cache.del([otpKey(phone), rateKey(phone), blockKey(phone)])
}
