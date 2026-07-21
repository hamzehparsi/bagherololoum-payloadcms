import type { GlobalConfig } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'

export const PaymentSettings: GlobalConfig = {
  slug: 'payment-settings',
  label: 'تنظیمات پرداخت',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  fields: [
    {
      name: 'suggestedAmounts',
      type: 'array',
      label: 'مبالغ پیشنهادی (تومان)',
      labels: {
        singular: 'مبلغ',
        plural: 'مبالغ',
      },
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'مبلغ',
        },
      ],
    },
    {
      name: 'minCustomAmount',
      type: 'number',
      defaultValue: 10000,
      label: 'حداقل مبلغ دلخواه (تومان)',
    },
  ],
}
