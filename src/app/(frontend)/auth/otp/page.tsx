'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import AuthShell from '@/components/auth/AuthShell'
import OtpInput from '@/components/auth/OtpInput'

import { requestOtp, verifyOtp } from '../actions/request-otp'
import { OTP_TTL_SECONDS } from '@/lib/otp-constants'
import { appendNextParam, getSafeNextPath } from '@/lib/safe-redirect'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function OtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const next = getSafeNextPath(searchParams.get('next'))

  const [code, setCode] = useState('')
  const [pending, startTransition] = useTransition()
  const [resendPending, startResendTransition] = useTransition()
  const [timeLeft, setTimeLeft] = useState(OTP_TTL_SECONDS)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!phone) router.replace('/auth')
  }, [phone, router])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVerify = () => {
    if (code.length !== 6) {
      toast.error('کد باید ۶ رقمی باشد')
      return
    }

    startTransition(async () => {
      const result = await verifyOtp(phone, code)

      if (result.success) {
        toast.success('ورود با موفقیت انجام شد')
        if (result.needsProfile) {
          router.replace(appendNextParam('/profile/complete', next))
        } else {
          router.replace(next || '/')
        }
        router.refresh()
      } else {
        toast.error(result.error || 'کد اشتباه است')
        setCode('')
      }
    })
  }

  const handleResend = () => {
    if (!canResend) return

    startResendTransition(async () => {
      const result = await requestOtp(phone)

      if (result.success) {
        toast.success('کد جدید ارسال شد')
        setTimeLeft(OTP_TTL_SECONDS)
        setCanResend(false)
        setCode('')
      } else {
        toast.error(result.error || 'خطا در ارسال مجدد کد')
      }
    })
  }

  return (
    <AuthShell
      title="تأیید کد"
      description={`کد ۶ رقمی ارسال‌شده به ${phone} را وارد کنید.`}
      backHref="/auth"
      backLabel="تغییر شماره"
    >
      <div className="space-y-6">
        <OtpInput value={code} onChange={setCode} disabled={pending} />

        <Button
          onClick={handleVerify}
          className="h-11 w-full text-sm font-medium"
          disabled={pending || code.length !== 6}
        >
          {pending ? 'در حال بررسی...' : 'تأیید و ورود'}
        </Button>

        <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-center">
          {timeLeft > 0 ? (
            <p className="text-xs text-muted-foreground">
              ارسال مجدد تا{' '}
              <span className="font-medium text-foreground">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <Button
              variant="link"
              onClick={handleResend}
              disabled={resendPending}
              className="h-auto p-0 text-xs"
            >
              {resendPending ? 'در حال ارسال...' : 'ارسال مجدد کد'}
            </Button>
          )}
        </div>
      </div>
    </AuthShell>
  )
}
