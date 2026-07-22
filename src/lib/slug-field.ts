import type { Field } from 'payload'

import { generateSlug } from '@/lib/slug'

type SlugFieldOptions = {
  description?: string
}

/** فیلد slug فقط‌خواندنی که به‌صورت خودکار از عنوان ساخته می‌شود */
export function createSlugField(options: SlugFieldOptions = {}): Field {
  return {
    name: 'slug',
    type: 'text',
    label: 'نامک (URL)',
    required: true,
    unique: true,
    index: true,
    admin: {
      description: options.description || 'آدرس صفحه - به صورت خودکار از عنوان تولید می‌شود',
      position: 'sidebar',
      readOnly: true,
    },
    hooks: {
      beforeValidate: [
        ({ data }) => {
          if (data?.title) {
            return generateSlug(data.title)
          }
          return undefined
        },
      ],
    },
  }
}
