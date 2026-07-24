import type { CollectionConfig } from 'payload'

import { isContentManager } from '@/access/isContentManager'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'

const Occasions: CollectionConfig = {
  slug: 'occasions',
  admin: {
    useAsTitle: 'title',
    group: 'مالی',
  },
  labels: {
    singular: 'مناسبت',
    plural: 'مناسبت‌ها',
  },
  access: {
    create: isContentManager,
    update: isContentManager,
    delete: isContentManager,
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'عنوان مناسبت (مثلاً عید غدیر)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'توضیحات',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر مناسبت',
      admin: {
        description: 'در صفحه اصلی و کارت مناسبت نمایش داده می‌شود.',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'تاریخ شروع',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy/MM/dd',
        },
        components: {
          Field: '@/components/admin/JalaliDateField#JalaliDateField',
          Cell: '@/components/admin/JalaliDateCell#JalaliDateCell',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'تاریخ پایان',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy/MM/dd',
        },
        components: {
          Field: '@/components/admin/JalaliDateField#JalaliDateField',
          Cell: '@/components/admin/JalaliDateCell#JalaliDateCell',
        },
      },
    },
    {
      name: 'isFixedAmount',
      type: 'checkbox',
      defaultValue: false,
      label: 'مبلغ ثابت (کاربر نمی‌تواند تغییر دهد)',
      admin: {
        description:
          'اگر تیک بخوردید، باید مبلغ ثابت را مشخص کنید و کاربر فقط همان مبلغ را پرداخت می‌کند.',
      },
    },
    {
      name: 'fixedAmount',
      type: 'number',
      label: 'مبلغ ثابت (به تومان)',
      admin: {
        condition: (data) => data.isFixedAmount === true,
      },
    },
    {
      name: 'targetAmount',
      type: 'number',
      label: 'هدف مالی (به تومان)',
      admin: {
        description:
          'اختیاری — اگر مشخص شود، در صفحه اصلی نوار پیشرفت جمع‌آوری کمک نمایش داده می‌شود.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'فعال بودن مناسبت برای نمایش در فرانت‌اند',
    },
    ...jalaliTimestampFields,
  ],
}

export default Occasions
