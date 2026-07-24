import type { CollectionConfig } from 'payload'

import { donorBeforeValidate } from '@/hooks/donorBeforeValidate'
import { jalaliTimestampFields } from '@/lib/payload-timestamp-fields'

const Donors: CollectionConfig = {
  slug: 'donors',
  labels: {
    singular: 'درخواست دهنده',
    plural: 'درخواست دهندگان',
  },
  admin: {
    useAsTitle: 'username',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: false,
    },
    tokenExpiration: 60 * 60 * 24 * 7,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      if (user?.collection === 'donors') return { id: { equals: user.id } }
      return false
    },
    update: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      if (user?.collection === 'donors') return { id: { equals: user.id } }
      return false
    },
    create: () => true,
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      label: 'شماره همراه',
      required: true,
      unique: true,
      admin: {
        description: 'شماره موبایل به فرمت 09xxxxxxxxx',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'نام',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'نام خانوادگی',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'تصویر پروفایل',
      admin: {
        description: 'کاربر می‌تواند از صفحه پروفایل سایت این تصویر را تغییر دهد.',
      },
    },
    {
      name: 'avatarPreset',
      type: 'select',
      label: 'قالب رنگی پروفایل',
      defaultValue: 'gradient-1',
      options: [
        { label: 'سبز', value: 'gradient-1' },
        { label: 'آبی', value: 'gradient-2' },
        { label: 'بنفش', value: 'gradient-3' },
        { label: 'طلایی', value: 'gradient-4' },
        { label: 'صورتی', value: 'gradient-5' },
        { label: 'ارغوانی', value: 'gradient-6' },
      ],
      admin: {
        description: 'اگر کاربر تصویری بارگذاری نکرده باشد، این گرادیانت نمایش داده می‌شود.',
      },
    },
    ...jalaliTimestampFields,
  ],
  hooks: {
    beforeValidate: [donorBeforeValidate],
  },
}

export default Donors
