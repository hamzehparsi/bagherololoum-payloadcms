import type { CollectionConfig } from 'payload'

import { isContentManager } from '@/access/isContentManager'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'
import { createSlugField } from '@/lib/slug-field'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'محتوا',
    defaultColumns: ['title', 'slug', 'isPublished'],
  },
  labels: {
    singular: 'صفحه',
    plural: 'صفحات',
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
      label: 'عنوان صفحه (مثلاً درباره هیات، فعالیت‌های جهادی)',
    },
    createSlugField(),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر صفحه (اختیاری)',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'خلاصه (برای SEO)',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'محتوای صفحه',
    },
    {
      name: 'showBoardMembers',
      type: 'checkbox',
      defaultValue: false,
      label: 'نمایش اعضای هیات امنا در انتهای این صفحه',
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

export default Pages
