import { generatePageMetadata } from '@/lib/page-metadata'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'ورود / ثبت‌نام',
    path: '/auth',
    noIndex: true,
  })
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
