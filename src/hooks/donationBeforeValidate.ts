import crypto from 'crypto'
import type { CollectionBeforeValidateHook } from 'payload'

export const donationBeforeValidate: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data

  if (!data.trackingCode) {
    data.trackingCode = crypto.randomBytes(6).toString('hex').toUpperCase()
  }

  if (data.occasion && data.amount != null) {
    const occasionId =
      typeof data.occasion === 'object' && data.occasion !== null
        ? (data.occasion as { id: number }).id
        : data.occasion

    const occasion = await req.payload.findByID({
      collection: 'occasions',
      id: occasionId as number,
    })

    if (occasion.isFixedAmount && occasion.fixedAmount != null && data.amount !== occasion.fixedAmount) {
      throw new Error('مبلغ باید برابر مبلغ ثابت مناسبت باشد.')
    }

    // معرف فقط برای حمایت عمومی معنا دارد
    data.referredBy = null
  }

  return data
}
