import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { fa } from '@payloadcms/translations/languages/fa'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Donors from './collections/Donors'
import Occasions from './collections/Occasions'
import Donations from './collections/Donations'
import { PaymentSettings } from './globals/PaymentSettings'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dashboard: {
      widgets: [
        {
          slug: 'total-raised',
          label: 'جمع کمک‌های موفق',
          Component: '@/components/admin/DashboardWidgets#TotalRaisedWidget',
          minWidth: 'x-small',
          maxWidth: 'full',
        },
        {
          slug: 'success-count',
          label: 'تعداد پرداخت موفق',
          Component: '@/components/admin/DashboardWidgets#SuccessCountWidget',
          minWidth: 'x-small',
          maxWidth: 'full',
        },
        {
          slug: 'pending-count',
          label: 'در انتظار پرداخت',
          Component: '@/components/admin/DashboardWidgets#PendingCountWidget',
          minWidth: 'x-small',
          maxWidth: 'full',
        },
        {
          slug: 'occasions-breakdown',
          label: 'تفکیک به‌ازای مناسبت',
          Component: '@/components/admin/DashboardWidgets#OccasionsBreakdownWidget',
          minWidth: 'small',
          maxWidth: 'full',
        },
      ],
      defaultLayout: [
        { widgetSlug: 'total-raised', width: 'small' },
        { widgetSlug: 'success-count', width: 'small' },
        { widgetSlug: 'pending-count', width: 'small' },
        { widgetSlug: 'occasions-breakdown', width: 'large' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
  },
  i18n: {
    fallbackLanguage: 'fa',
    supportedLanguages: { fa, en },
  },
  collections: [Users, Media, Donors, Occasions, Donations],
  globals: [PaymentSettings, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
