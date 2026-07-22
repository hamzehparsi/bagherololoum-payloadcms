import Link from 'next/link'

import { resolveExternalHref, resolveMapHref } from '@/lib/navigation'
import type { Navigation } from '@/payload-types'

const socialLabels: Record<string, string> = {
  instagram: 'اینستاگرام',
  telegram: 'تلگرام',
  eitaa: 'ایتا',
  aparat: 'آپارات',
  youtube: 'یوتیوب',
  other: 'لینک',
}

type FooterPageLink = {
  title: string
  href: string
}

type SiteFooterProps = {
  navigation: Navigation
  siteName: string
  pages: FooterPageLink[]
}

export default function SiteFooter({ navigation, siteName, pages }: SiteFooterProps) {
  const pageLinks: FooterPageLink[] = [
    { title: 'هیات امنا', href: '/board' },
    ...pages,
  ]

  // لینک‌های دستی فوتر که با صفحات تکراری نباشند
  const manualLinks = (navigation.footerLinks || []).filter(
    (item) => !pageLinks.some((page) => page.href === item.href),
  )

  const mapHref = resolveMapHref(navigation.footerMapUrl, navigation.footerAddress)

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-base font-bold">{siteName}</p>
          {navigation.footerAbout && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {navigation.footerAbout}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm font-bold">صفحات</p>
          <ul className="mt-3 space-y-2">
            {pageLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.title}
                </Link>
              </li>
            ))}
            {manualLinks.map((item) => (
              <li key={item.id || item.href}>
                <Link
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">تماس با ما</p>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            {navigation.footerAddress && <p className="leading-relaxed">{navigation.footerAddress}</p>}
            {navigation.footerPhone && (
              <p>
                <a href={`tel:${navigation.footerPhone}`} className="hover:text-foreground">
                  تلفن: {navigation.footerPhone}
                </a>
              </p>
            )}
            {navigation.footerWhatsapp && (
              <p>
                <a
                  href={`https://wa.me/${navigation.footerWhatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  واتساپ: {navigation.footerWhatsapp}
                </a>
              </p>
            )}
            {navigation.footerEmail && (
              <p>
                <a href={`mailto:${navigation.footerEmail}`} className="hover:text-foreground">
                  ایمیل: {navigation.footerEmail}
                </a>
              </p>
            )}
            {mapHref && (
              <p>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  مشاهده روی نقشه
                </a>
              </p>
            )}
            {!navigation.footerAddress &&
              !navigation.footerPhone &&
              !navigation.footerWhatsapp &&
              !navigation.footerEmail &&
              !mapHref && (
                <p className="text-xs">اطلاعات تماس هنوز در بخش «منو و فوتر» ثبت نشده است.</p>
              )}
          </div>

          {(navigation.socialLinks || []).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(navigation.socialLinks || []).map((social) => {
                const href = resolveExternalHref(social.url)
                if (!href) return null

                return (
                  <a
                    key={social.id || social.url}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {social.label || socialLabels[social.platform] || social.platform}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {navigation.copyrightText && (
        <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
          {navigation.copyrightText}
        </div>
      )}
    </footer>
  )
}

export type { FooterPageLink }
