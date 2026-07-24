'use client'

import { useTransition } from 'react'
import { CreditCard } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { confirmDonation } from '@/app/(frontend)/donate/actions/confirm-donation'

export default function ConfirmDonationButton() {
  const [pending, startTransition] = useTransition()

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await confirmDonation()
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  return (
    <Button variant="secondary" className="h-12 w-full text-sm font-semibold" disabled={pending} onClick={handleConfirm}>
      <CreditCard className="ml-2 h-4 w-4" />
      {pending ? 'در حال آماده‌سازی...' : 'رفتن به درگاه پرداخت'}
    </Button>
  )
}
