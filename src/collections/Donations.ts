import type { CollectionConfig, Where } from 'payload'

import { isSuperAdmin } from '../access/isSuperAdmin'
import { isFinance } from '../access/isFinance'
import { donationBeforeValidate } from '@/hooks/donationBeforeValidate'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'
import { buildDonationsCsv } from '@/lib/donations-csv'

const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'trackingCode',
    group: 'مالی',
    defaultColumns: ['trackingCode', 'amount', 'status', 'createdAt'],
    components: {
      beforeListTable: ['@/components/admin/DonationsExportButton#DonationsExportButton'],
    },
    description: 'لیست تمامی کمک‌های مالی',
  },
  labels: {
    singular: 'کمک‌ مالی',
    plural: 'کمک‌های مالی',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      if (user.collection === 'donors') return { donor: { equals: user.id } }
      return false
    },
    create: ({ req: { user } }) =>
      user?.collection === 'donors' || user?.collection === 'users' || false,
    update: isFinance,
    delete: isSuperAdmin,
  },
  hooks: {
    beforeValidate: [donationBeforeValidate],
  },
  endpoints: [
    {
      path: '/export-csv',
      method: 'get',
      handler: async (req) => {
        if (!req.user || req.user.collection !== 'users') {
          return Response.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const url = new URL(req.url || '', 'http://localhost')
        const from = url.searchParams.get('from')
        const to = url.searchParams.get('to')
        const status = url.searchParams.get('status')

        const conditions: Where[] = []
        if (from) conditions.push({ createdAt: { greater_than_equal: from } })
        if (to) conditions.push({ createdAt: { less_than_equal: to } })
        if (status && ['pending', 'success', 'failed', 'expired'].includes(status)) {
          conditions.push({ status: { equals: status } })
        }

        const result = await req.payload.find({
          collection: 'donations',
          depth: 1,
          limit: 10000,
          sort: '-createdAt',
          ...(conditions.length > 0 ? { where: { and: conditions } } : {}),
        })

        const csv = buildDonationsCsv(result.docs)

        return new Response(csv, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="donations-${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        })
      },
    },
  ],
  fields: [
    {
      name: 'donor',
      type: 'relationship',
      relationTo: 'donors',
      required: true,
      label: 'کمک‌کننده',
    },
    {
      name: 'occasion',
      type: 'relationship',
      relationTo: 'occasions',
      required: false,
      label: 'مناسبت',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'مبلغ (تومان)',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'در انتظار پرداخت', value: 'pending' },
        { label: 'موفق', value: 'success' },
        { label: 'ناموفق', value: 'failed' },
        { label: 'منقضی‌شده', value: 'expired' },
      ],
      defaultValue: 'pending',
      required: true,
      label: 'وضعیت',
    },
    {
      name: 'trackingCode',
      type: 'text',
      label: 'کد پیگیری',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paymentMethod',
      type: 'text',
      label: 'روش پرداخت',
    },
    {
      name: 'authority',
      type: 'text',
      label: 'Authority درگاه',
      admin: { readOnly: true },
    },
    {
      name: 'refId',
      type: 'text',
      label: 'کد مرجع پرداخت',
      admin: { readOnly: true },
    },
    ...jalaliTimestampFields,
  ],
}

export default Donations
