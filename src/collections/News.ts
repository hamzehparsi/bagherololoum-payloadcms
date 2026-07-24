import type { CollectionConfig } from 'payload'

import { isContentManager } from '@/access/isContentManager'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'
import { createSlugField } from '@/lib/slug-field'

const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    group: 'محتوا',
    defaultColumns: ['title', 'publishedAt', 'isPublished'],
  },
  labels: {
    singular: 'خبر',
    plural: 'اخبار',
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
      label: 'عنوان خبر',
    },
    createSlugField(),
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر شاخص',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'خلاصه خبر',
      admin: {
        description: 'در کارت خبر و توضیحات SEO استفاده می‌شود.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'متن خبر',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'تاریخ انتشار',
      defaultValue: () => new Date().toISOString(),
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
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'انتشار در سایت',
    },
    ...jalaliTimestampFields,
  ],
}

export default News
