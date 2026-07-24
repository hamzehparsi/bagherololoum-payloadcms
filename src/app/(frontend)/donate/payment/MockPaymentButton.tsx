'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { mockCompletePayment } from '@/app/(frontend)/donate/actions/initiate-payment'

type MockPaymentButtonProps = {
  donationId: number
}

export default function MockPaymentButton({ donationId }: MockPaymentButtonProps) {
  const [pending, startTransition] = useTransition()

  const handleMockPay = () => {
    startTransition(async () => {
      try {
        const result = await mockCompletePayment(donationId)
        if (result?.error) {
          toast.error(result.error)
        }
      } catch {
        // redirect from server action
      }
    })
  }

  return (
    <Button variant="outline" className="h-12 w-full" disabled={pending} onClick={handleMockPay}>
      {pending ? 'در حال پردازش...' : 'شبیه‌سازی پرداخت موفق'}
    </Button>
  )
}
