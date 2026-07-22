import type { CollectionConfig } from 'payload'

import { isContentManager } from '@/access/isContentManager'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'
import { createSlugField } from '@/lib/slug-field'

const Galleries: CollectionConfig = {
  slug: 'galleries',
  admin: {
    useAsTitle: 'title',
    group: 'محتوا',
    defaultColumns: ['title', 'event', 'isPublished', 'createdAt'],
  },
  labels: {
    singular: 'گزارش تصویری',
    plural: 'گزارش‌های تصویری',
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
      label: 'عنوان گزارش (مثلاً شب سوم محرم ۱۴۰۵)',
    },
    createSlugField(),
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      label: 'رویداد مرتبط',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'توضیح کوتاه',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر شاخص',
      admin: {
        description: 'اگر خالی باشد، اولین تصویر گالری استفاده می‌شود.',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      label: 'تصاویر',
      admin: {
        description: 'می‌توانید چند تصویر را یک‌جا انتخاب یا بارگذاری کنید.',
      },
      filterOptions: {
        mimeType: { contains: 'image' },
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

export default Galleries
