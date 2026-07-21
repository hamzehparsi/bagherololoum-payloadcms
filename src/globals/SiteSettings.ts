import type { GlobalConfig } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdmin'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'تنظیمات سایت و SEO',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'اطلاعات سایت',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              label: 'نام سایت',
              defaultValue: 'هیات باقرالعلوم (ع)',
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              label: 'آدرس سایت (دامنه)',
              admin: {
                description: 'مثال: https://bagherololoum.ir — می‌توانید فقط دامنه هم بنویسید',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'توضیحات کوتاه سایت',
              admin: {
                description: 'برای meta description پیش‌فرض و snippet موتورهای جستجو',
              },
            },
            {
              name: 'siteLogo',
              type: 'upload',
              relationTo: 'media',
              label: 'لوگوی سایت',
              admin: {
                description: 'در رسید PDF و بخش‌های برند سایت استفاده می‌شود',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'defaultTitle',
              type: 'text',
              label: 'عنوان پیش‌فرض (Title)',
              admin: {
                description: 'عنوان صفحه اصلی و fallback سایر صفحات',
              },
            },
            {
              name: 'titleTemplate',
              type: 'text',
              label: 'الگوی عنوان صفحات داخلی',
              defaultValue: '%s | هیات باقرالعلوم (ع)',
              admin: {
                description: 'از %s برای جایگزینی عنوان صفحه استفاده کنید',
              },
            },
            {
              name: 'keywords',
              type: 'textarea',
              label: 'کلمات کلیدی',
              admin: {
                description: 'با ویرگول جدا کنید. مثال: خیریه, هیئت, کمک مالی',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'تصویر Open Graph',
              admin: {
                description: 'تصویر پیش‌فرض برای اشتراک‌گذاری در شبکه‌های اجتماعی',
              },
            },
            {
              name: 'twitterUsername',
              type: 'text',
              label: 'نام کاربری توییتر / X',
              admin: {
                description: 'بدون @ — اختیاری',
              },
            },
            {
              name: 'googleSiteVerification',
              type: 'text',
              label: 'Google Site Verification',
              admin: {
                description: 'مقدار content از meta tag گوگل — اختیاری',
              },
            },
            {
              name: 'allowIndexing',
              type: 'checkbox',
              defaultValue: true,
              label: 'اجازه ایندکس شدن توسط موتورهای جستجو',
            },
          ],
        },
      ],
    },
  ],
}
