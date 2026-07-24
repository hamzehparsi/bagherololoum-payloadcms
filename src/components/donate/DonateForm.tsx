'use client'

import { useMemo, useState, useTransition } from 'react'
import { Heart, Sparkles, Building2, Users } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatTomans } from '@/lib/format'
import AmountSelector, { type DonateOccasionOption } from '@/components/donate/AmountSelector'
import { prepareDonation } from '@/app/(frontend)/donate/actions/prepare-donation'
import {
  GENERAL_DONATION_DESCRIPTION,
  GENERAL_DONATION_TITLE,
  type DonationTarget,
} from '@/lib/payment-amounts'

export type BoardMemberOption = {
  id: number
  name: string
  role?: string | null
}

type DonateFormProps = {
  occasions: DonateOccasionOption[]
  boardMembers: BoardMemberOption[]
  globalSuggestedAmounts: number[]
  minCustomAmount: number
  isLoggedIn: boolean
  initialTarget?: DonationTarget | null
}

export default function DonateForm({
  occasions,
  boardMembers,
  globalSuggestedAmounts,
  minCustomAmount,
  isLoggedIn,
  initialTarget = null,
}: DonateFormProps) {
  const [selectedTarget, setSelectedTarget] = useState<DonationTarget | null>(initialTarget)
  const [amount, setAmount] = useState<number | null>(null)
  const [referredById, setReferredById] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()

  const selectedOccasion = useMemo(() => {
    if (selectedTarget === null || selectedTarget === 'general') return null
    return occasions.find((item) => item.id === selectedTarget) ?? null
  }, [occasions, selectedTarget])

  const selectedLabel = useMemo(() => {
    if (selectedTarget === 'general') return GENERAL_DONATION_TITLE
    if (selectedOccasion) return selectedOccasion.title
    return null
  }, [selectedTarget, selectedOccasion])

  const selectedReferrer = useMemo(() => {
    if (!referredById) return null
    return boardMembers.find((member) => member.id === referredById) ?? null
  }, [boardMembers, referredById])

  const suggestedAmounts = useMemo(() => {
    if (!selectedTarget) return []
    if (selectedOccasion?.isFixedAmount) return []
    return globalSuggestedAmounts
  }, [selectedTarget, selectedOccasion, globalSuggestedAmounts])

  const effectiveAmount = useMemo(() => {
    if (selectedOccasion?.isFixedAmount && selectedOccasion.fixedAmount != null) {
      return selectedOccasion.fixedAmount
    }
    return amount
  }, [selectedOccasion, amount])

  const handleTargetSelect = (target: DonationTarget) => {
    setSelectedTarget(target)
    setAmount(null)
    if (target !== 'general') setReferredById(null)
  }

  const handleSubmit = () => {
    if (!selectedTarget) {
      toast.error('لطفاً موضوع کمک خود را انتخاب کنید')
      return
    }

    if (!effectiveAmount) {
      toast.error('لطفاً مبلغ را انتخاب یا وارد کنید')
      return
    }

    const occasionId = selectedTarget === 'general' ? null : selectedTarget
    const referrer = selectedTarget === 'general' ? referredById : null

    startTransition(async () => {
      const result = await prepareDonation(occasionId, effectiveAmount, referrer)

      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-red/5 via-background to-brand-green/5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">مشارکت در کمک مالی</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoggedIn
                ? 'ابتدا موضوع کمک را انتخاب کنید، سپس مبلغ را مشخص کنید.'
                : 'موضوع و مبلغ را انتخاب کنید؛ قبل از پرداخت وارد حساب می‌شوید.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-red" />
          <p className="text-sm font-semibold">موضوع کمک</p>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => handleTargetSelect('general')}
            className={cn(
              'rounded-2xl border p-4 text-right transition-all',
              selectedTarget === 'general'
                ? 'border-brand-red bg-brand-red/5 ring-1 ring-brand-red/20'
                : 'border-border bg-card hover:border-brand-red/30',
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{GENERAL_DONATION_TITLE}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {GENERAL_DONATION_DESCRIPTION}
                </p>
              </div>
            </div>
          </button>

          {occasions.map((occasion) => {
            const selected = selectedTarget === occasion.id
            return (
              <button
                key={occasion.id}
                type="button"
                onClick={() => handleTargetSelect(occasion.id)}
                className={cn(
                  'rounded-2xl border p-4 text-right transition-all',
                  selected
                    ? 'border-brand-red bg-brand-red/5 ring-1 ring-brand-red/20'
                    : 'border-border bg-card hover:border-brand-red/30',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{occasion.title}</p>
                    {occasion.description && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {occasion.description}
                      </p>
                    )}
                  </div>
                  {occasion.isFixedAmount && occasion.fixedAmount != null && (
                    <span className="shrink-0 rounded-full bg-brand-red/10 px-3 py-1 text-xs font-medium text-brand-red">
                      {formatTomans(occasion.fixedAmount)}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedTarget === 'general' && boardMembers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-green" />
            <p className="text-sm font-semibold">معرف (اختیاری)</p>
          </div>
          <p className="text-xs text-muted-foreground">
            اگر یکی از اعضای هیات امنا شما را به این کمک دعوت کرده، او را انتخاب کنید.
          </p>
          <select
            value={referredById ?? ''}
            onChange={(event) => {
              const value = event.target.value
              setReferredById(value ? Number(value) : null)
            }}
            disabled={pending}
            className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30"
          >
            <option value="">بدون معرف</option>
            {boardMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
                {member.role ? ` — ${member.role}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-semibold">مبلغ پرداخت</p>
        {!selectedTarget ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            برای انتخاب مبلغ، ابتدا موضوع کمک را مشخص کنید.
          </div>
        ) : (
          <AmountSelector
            fixedAmount={selectedOccasion?.isFixedAmount ? selectedOccasion.fixedAmount : null}
            suggestedAmounts={suggestedAmounts}
            minAmount={minCustomAmount}
            value={effectiveAmount}
            onChange={setAmount}
            disabled={pending}
          />
        )}
      </div>

      <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">مبلغ نهایی</span>
          <span className="text-base font-bold text-brand-red">
            {effectiveAmount ? formatTomans(effectiveAmount) : '—'}
          </span>
        </div>
        {selectedLabel && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>موضوع کمک</span>
            <span>{selectedLabel}</span>
          </div>
        )}
        {selectedReferrer && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>معرف</span>
            <span>{selectedReferrer.name}</span>
          </div>
        )}
      </div>

      <Button
        variant="secondary"
        className="h-12 w-full text-sm font-semibold"
        disabled={pending || !selectedTarget || !effectiveAmount}
        onClick={handleSubmit}
      >
        {pending ? 'در حال انتقال...' : 'تأیید و ادامه'}
      </Button>
    </div>
  )
}
