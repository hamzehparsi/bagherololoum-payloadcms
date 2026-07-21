'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import AuthShell from '@/components/auth/AuthShell'

import { requestOtp } from './actions/request-otp'
import { normalizeIranMobile, validateIranMobile } from '@/lib/validators'
import { appendNextParam } from '@/lib/safe-redirect'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  const [phone, setPhone] = useState('')
  const [pending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      if (!validateIranMobile(phone)) {
        toast.error('لطفاً شماره موبایل معتبر وارد کنید')
        return
      }

      const normalizedPhone = normalizeIranMobile(phone)
      const result = await requestOtp(normalizedPhone)

      if (result.success) {
        toast.success('کد تأیید ارسال شد')
        const otpPath = `/auth/otp?phone=${encodeURIComponent(normalizedPhone)}`
        router.push(appendNextParam(otpPath, next))
      } else {
        toast.error(result.error || 'خطایی رخ داد')
      }
    })
  }

  return (
    <AuthShell
      title="ورود / ثبت‌نام"
      description="برای ورود یا ایجاد حساب، شماره همراه خود را وارد کنید."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            شماره همراه
          </Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="09123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
              className="h-11 pr-10 text-center text-base tracking-widest"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">کد تأیید به همین شماره پیامک می‌شود.</p>
        </div>

        <Button type="submit" className="h-11 w-full text-sm font-medium" disabled={pending}>
          {pending ? 'در حال ارسال...' : 'دریافت کد تأیید'}
        </Button>
      </form>
    </AuthShell>
  )
}
