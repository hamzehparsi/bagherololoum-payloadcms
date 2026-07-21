'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { initiatePayment } from '@/app/(frontend)/donate/actions/initiate-payment'

type PayWithZarinpalButtonProps = {
  donationId: number
}

export default function PayWithZarinpalButton({ donationId }: PayWithZarinpalButtonProps) {
  const [pending, startTransition] = useTransition()

  const handlePay = () => {
    startTransition(async () => {
      try {
        await initiatePayment(donationId)
      } catch (err) {
        if (err instanceof Error && err.message === 'NEXT_REDIRECT') return
        toast.error('خطا در اتصال به درگاه پرداخت')
      }
    })
  }

  return (
    <Button className="h-12 w-full text-sm font-semibold" disabled={pending} onClick={handlePay}>
      {pending ? 'در حال انتقال...' : 'پرداخت با زرین‌پال'}
    </Button>
  )
}
