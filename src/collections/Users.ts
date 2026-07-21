import type { CollectionConfig } from 'payload'

import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'کاربر',
    plural: 'کاربران',
  },
  auth: true,

  admin: {
    useAsTitle: 'name',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        {
          label: 'مدیر کل',
          value: 'super-admin',
        },
        {
          label: 'مسئول مالی',
          value: 'finance',
        },
        {
          label: 'تولید محتوا',
          value: 'editor',
        },
      ],
    },
    ...jalaliTimestampFields,
  ],
}
