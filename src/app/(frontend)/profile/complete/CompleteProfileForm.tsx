'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import AuthShell from '@/components/auth/AuthShell'

import { updateProfile } from '@/app/(frontend)/auth/actions/update-profile'
import { getSafeNextPath } from '@/lib/safe-redirect'

export default function CompleteProfileForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = getSafeNextPath(searchParams.get('next'))
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [pending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const result = await updateProfile(firstName, lastName)

      if (result.success) {
        toast.success('پروفایل شما تکمیل شد')
        router.replace(next || '/')
        router.refresh()
      } else {
        toast.error(result.error || 'خطایی رخ داد')
      }
    })
  }

  return (
    <AuthShell
      title="تکمیل پروفایل"
      description="برای ادامه، نام و نام خانوادگی خود را وارد کنید."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            نام
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-11"
            placeholder="مثلاً محمد"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            نام خانوادگی
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-11"
            placeholder="مثلاً محمدی"
            required
          />
        </div>

        <Button type="submit" className="h-11 w-full text-sm font-medium" disabled={pending}>
          {pending ? 'در حال ذخیره...' : 'ذخیره و ادامه'}
        </Button>
      </form>
    </AuthShell>
  )
}
