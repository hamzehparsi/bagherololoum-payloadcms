import type { CollectionConfig } from 'payload'

import { isContentManager } from '@/access/isContentManager'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'
import { createSlugField } from '@/lib/slug-field'

export const podcastCategories = [
  { label: 'روضه', value: 'rawda' },
  { label: 'مداحی', value: 'maddahi' },
  { label: 'سخنرانی', value: 'lecture' },
  { label: 'پادکست', value: 'podcast' },
] as const

const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  admin: {
    useAsTitle: 'title',
    group: 'محتوا',
    defaultColumns: ['title', 'category', 'performer', 'isPublished'],
  },
  labels: {
    singular: 'صوت / پادکست',
    plural: 'صوت‌ها و پادکست‌ها',
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
      label: 'عنوان',
    },
    createSlugField(),
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'rawda',
      options: [...podcastCategories],
      label: 'دسته‌بندی',
    },
    {
      name: 'performer',
      type: 'text',
      label: 'سخنران / مداح',
    },
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'فایل صوتی',
      filterOptions: {
        mimeType: { contains: 'audio' },
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر کاور (اختیاری)',
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      label: 'رویداد مرتبط',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'توضیحات',
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

export default Podcasts
