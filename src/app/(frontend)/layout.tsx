import './globals.css' // ← حتماً این خط باشه
import { Toaster } from 'sonner'
import localFont from 'next/font/local'

import { generatePageMetadata } from '@/lib/page-metadata'

const AbarLow = localFont({
  src: [
    { path: '../../../public/fonts/woff2/AbarLowFaNum-Regular.woff2', weight: '400' },
    { path: '../../../public/fonts/woff2/AbarLowFaNum-SemiBold.woff2', weight: '600' },
    { path: '../../../public/fonts/woff2/AbarLowFaNum-Bold.woff2', weight: '700' },
    { path: '../../../public/fonts/woff2/AbarLowFaNum-ExtraBold.woff2', weight: '800' },
    { path: '../../../public/fonts/woff2/AbarLowFaNum-Black.woff2', weight: '900' },
  ],
  variable: '--font-abar-low',
  display: 'swap',
})

const AbarMid = localFont({
  src: [
    { path: '../../../public/fonts/woff2/AbarMidFaNum-Regular.woff2', weight: '400' },
    { path: '../../../public/fonts/woff2/AbarMidFaNum-SemiBold.woff2', weight: '600' },
    { path: '../../../public/fonts/woff2/AbarMidFaNum-Bold.woff2', weight: '700' },
    { path: '../../../public/fonts/woff2/AbarMidFaNum-ExtraBold.woff2', weight: '800' },
    { path: '../../../public/fonts/woff2/AbarMidFaNum-Black.woff2', weight: '900' },
  ],
  variable: '--font-abar-mid',
  display: 'swap',
})

const AbarHigh = localFont({
  src: [
    { path: '../../../public/fonts/woff2/AbarHighFaNum-Regular.woff2', weight: '400' },
    { path: '../../../public/fonts/woff2/AbarHighFaNum-SemiBold.woff2', weight: '600' },
    { path: '../../../public/fonts/woff2/AbarHighFaNum-Bold.woff2', weight: '700' },
    { path: '../../../public/fonts/woff2/AbarHighFaNum-ExtraBold.woff2', weight: '800' },
    { path: '../../../public/fonts/woff2/AbarHighFaNum-Black.woff2', weight: '900' },
  ],
  variable: '--font-abar-high',
  display: 'swap',
})
export async function generateMetadata() {
  return generatePageMetadata()
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${AbarLow.variable} ${AbarMid.variable} ${AbarHigh.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
