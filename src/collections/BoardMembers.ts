import type { CollectionConfig } from 'payload'

import { isContentManager } from '@/access/isContentManager'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'

const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  admin: {
    useAsTitle: 'name',
    group: 'محتوا',
    defaultColumns: ['name', 'role', 'order'],
  },
  labels: {
    singular: 'عضو هیات امنا',
    plural: 'هیات امنا',
  },
  access: {
    create: isContentManager,
    update: isContentManager,
    delete: isContentManager,
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'نام و نام خانوادگی',
    },
    {
      name: 'role',
      type: 'text',
      label: 'سمت (مثلاً رئیس هیات امنا)',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'عکس',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'معرفی کوتاه',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'ترتیب نمایش',
      admin: {
        description: 'عدد کوچک‌تر اول نمایش داده می‌شود.',
      },
    },
    ...jalaliTimestampFields,
  ],
}

export default BoardMembers
