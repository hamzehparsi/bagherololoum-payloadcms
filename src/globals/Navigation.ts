import type { GlobalConfig } from 'payload'

import { isContentManager } from '@/access/isContentManager'

const linkFields = [
  {
    name: 'label',
    type: 'text' as const,
    required: true,
    label: 'عنوان',
  },
  {
    name: 'href',
    type: 'text' as const,
    required: true,
    label: 'لینک',
    admin: {
      description: 'مسیر داخلی مثل ‎/events‎ یا آدرس کامل مثل https://...',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox' as const,
    defaultValue: false,
    label: 'باز شدن در تب جدید',
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'منو و فوتر',
  access: {
    read: () => true,
    update: isContentManager,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'منوی هدر',
          fields: [
            {
              name: 'headerItems',
              type: 'array',
              label: 'آیتم‌های منوی اصلی',
              labels: { singular: 'آیتم', plural: 'آیتم‌ها' },
              admin: {
                description: 'ترتیب همین‌جا تعیین‌کننده ترتیب نمایش در هدر است.',
              },
              defaultValue: [
                { label: 'رویدادها', href: '/events', openInNewTab: false },
                { label: 'گزارش تصویری', href: '/galleries', openInNewTab: false },
                { label: 'روضه و پادکست', href: '/podcasts', openInNewTab: false },
                { label: 'اخبار', href: '/news', openInNewTab: false },
                { label: 'کمک مالی', href: '/donate', openInNewTab: false },
              ],
              fields: linkFields,
            },
            {
              name: 'aboutMenuItems',
              type: 'array',
              label: 'زیرمنوی «پیرامون هیات»',
              labels: { singular: 'لینک', plural: 'لینک‌ها' },
              admin: {
                description:
                  'این آیتم‌ها در هاور منوی «پیرامون هیات» نمایش داده می‌شوند. می‌توانید صفحه CMS انتخاب کنید یا لینک سفارشی (مثل /board) بدهید.',
              },
              defaultValue: [
                {
                  label: 'هیات امنا',
                  linkType: 'custom',
                  href: '/board',
                  openInNewTab: false,
                },
              ],
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'عنوان نمایشی',
                },
                {
                  name: 'linkType',
                  type: 'radio',
                  required: true,
                  defaultValue: 'page',
                  label: 'نوع لینک',
                  options: [
                    { label: 'از لیست صفحات', value: 'page' },
                    { label: 'لینک سفارشی', value: 'custom' },
                  ],
                  admin: {
                    layout: 'horizontal',
                  },
                },
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  label: 'صفحه',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.linkType === 'page',
                    description: 'صفحات منتشرشده را انتخاب کنید (مثلاً معرفی هیات).',
                  },
                },
                {
                  name: 'href',
                  type: 'text',
                  label: 'لینک سفارشی',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.linkType === 'custom',
                    description:
                      'مسیر داخلی مثل ‎/board‎ یا ‎/donate‎ یا آدرس کامل https://...',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'باز شدن در تب جدید',
                },
              ],
            },
          ],
        },
        {
          label: 'فوتر',
          fields: [
            {
              name: 'footerAddress',
              type: 'textarea',
              label: 'آدرس',
              admin: {
                description: 'آدرس کامل هیات برای نمایش در فوتر',
              },
            },
            {
              name: 'footerPhone',
              type: 'text',
              label: 'شماره تماس',
            },
            {
              name: 'footerWhatsapp',
              type: 'text',
              label: 'شماره واتساپ',
              admin: {
                description: 'با کد کشور، مثال: 989121234567',
              },
            },
            {
              name: 'footerEmail',
              type: 'email',
              label: 'ایمیل',
            },
            {
              name: 'footerMapUrl',
              type: 'text',
              label: 'لینک نقشه (گوگل‌مپ / نشان)',
              admin: {
                description:
                  'حتماً لینک کامل با https وارد کنید، مثال: https://maps.app.goo.gl/... — آدرس متنی را در فیلد «آدرس» بگذارید، نه اینجا.',
              },
            },
            {
              name: 'footerLinks',
              type: 'array',
              label: 'لینک‌های اضافی فوتر',
              labels: { singular: 'لینک', plural: 'لینک‌ها' },
              admin: {
                description:
                  'صفحات منتشرشده و «هیات امنا» به‌صورت خودکار در فوتر می‌آیند. اینجا فقط لینک‌های اضافه بگذارید.',
              },
              defaultValue: [{ label: 'کمک مالی', href: '/donate', openInNewTab: false }],
              fields: linkFields,
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'شبکه‌های اجتماعی',
              labels: { singular: 'شبکه', plural: 'شبکه‌ها' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  label: 'پلتفرم',
                  options: [
                    { label: 'اینستاگرام', value: 'instagram' },
                    { label: 'تلگرام', value: 'telegram' },
                    { label: 'ایتا', value: 'eitaa' },
                    { label: 'آپارات', value: 'aparat' },
                    { label: 'یوتیوب', value: 'youtube' },
                    { label: 'سایت دیگر', value: 'other' },
                  ],
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'عنوان نمایشی (اختیاری)',
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'آدرس',
                },
              ],
            },
            {
              name: 'copyrightText',
              type: 'text',
              label: 'متن کپی‌رایت',
              defaultValue: '© هیات باقرالعلوم (ع) — تمامی حقوق محفوظ است.',
            },
          ],
        },
      ],
    },
  ],
}
