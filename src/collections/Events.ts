import type { CollectionConfig } from 'payload'

import { isContentManager } from '@/access/isContentManager'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'
import { createSlugField } from '@/lib/slug-field'

const jalaliDateAdmin = {
  components: {
    Field: '@/components/admin/JalaliDateField#JalaliDateField',
    Cell: '@/components/admin/JalaliDateCell#JalaliDateCell',
  },
}

const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'محتوا',
    defaultColumns: ['title', 'startDate', 'isPublished'],
  },
  labels: {
    singular: 'رویداد',
    plural: 'رویدادها',
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
      label: 'عنوان رویداد (مثلاً محرم ۱۴۰۵)',
    },
    createSlugField(),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر رویداد',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'خلاصه کوتاه',
      admin: {
        description: 'در کارت رویداد و لیست‌ها نمایش داده می‌شود.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'توضیحات کامل',
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'تاریخ شروع',
      admin: jalaliDateAdmin,
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'تاریخ پایان',
      admin: jalaliDateAdmin,
    },
    {
      name: 'location',
      type: 'text',
      label: 'مکان برگزاری',
    },
    {
      name: 'relatedOccasion',
      type: 'relationship',
      relationTo: 'occasions',
      label: 'مناسبت کمک مالی مرتبط',
      admin: {
        description: 'اختیاری — اگر انتخاب شود، دکمه «کمک به این برنامه» در صفحه رویداد نمایش داده می‌شود.',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'انتشار در سایت',
    },
    ...jalaliTimestampFields,
  ],
}

export default Events
