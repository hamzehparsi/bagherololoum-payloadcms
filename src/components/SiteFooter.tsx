import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Map, Mail, MessageCircle } from 'lucide-react'

import { resolveMapHref } from '@/lib/navigation'
import type { Navigation } from '@/payload-types'

type FooterPageLink = {
  title: string
  href: string
}

type SiteFooterProps = {
  navigation: Navigation
  siteName: string
  siteDescription?: string | null
  logoUrl?: string | null
  pages: FooterPageLink[]
}

export default function SiteFooter({
  navigation,
  siteName,
  siteDescription,
  logoUrl,
  pages,
}: SiteFooterProps) {
  const pageLinks: FooterPageLink[] = [{ title: 'هیات امنا', href: '/board' }, ...pages]

  const manualLinks = (navigation.footerLinks || []).filter(
    (item) => !pageLinks.some((page) => page.href === item.href),
  )

  const quickLinks = [
    ...pageLinks.map((item) => ({
      key: item.href,
      label: item.title,
      href: item.href,
      external: false,
    })),
    ...manualLinks.map((item) => ({
      key: item.id || item.href,
      label: item.label,
      href: item.href,
      external: Boolean(item.openInNewTab),
    })),
  ]

  const mapHref = resolveMapHref(navigation.footerMapUrl, navigation.footerAddress)

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="-mt-3">
          <div className="flex flex-col items-start gap-3">
            {logoUrl ? (
              <span className="relative h-24 w-24 overflow-hidden -mb-3">
                <Image src={logoUrl} alt={siteName} fill sizes="96px" className="object-contain" />
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo.svg"
                alt={siteName}
                className="h-24 -mb-2 w-auto max-w-[220px] object-contain"
              />
            )}
            <p className="text-base font-black text-brand-green">{siteName}</p>
          </div>

          {siteDescription && (
            <p className=" text-xs leading-relaxed text-muted-foreground mt-1">{siteDescription}</p>
          )}
        </div>

        <div>
          <p className="text-sm font-bold text-brand-green">دسترسی سریع</p>
          <ul className="mt-3 space-y-1.5">
            {quickLinks.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:-translate-x-1 hover:bg-brand-red/5 hover:text-brand-red"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green transition-colors group-hover:bg-brand-red" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold text-brand-green">تماس با ما</p>
          <div className="mt-3 space-y-3 text-xs text-muted-foreground">
            {navigation.footerAddress && (
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                <span>{navigation.footerAddress}</span>
              </p>
            )}
            {navigation.footerPhone && (
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand-red" />
                <a href={`tel:${navigation.footerPhone}`} className="hover:text-brand-red">
                  {navigation.footerPhone}
                </a>
              </p>
            )}
            {navigation.footerWhatsapp && (
              <p className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 shrink-0 text-brand-red" />
                <a
                  href={`https://wa.me/${navigation.footerWhatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-red"
                >
                  {navigation.footerWhatsapp}
                </a>
              </p>
            )}
            {navigation.footerEmail && (
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-red" />
                <a href={`mailto:${navigation.footerEmail}`} className="hover:text-brand-red">
                  {navigation.footerEmail}
                </a>
              </p>
            )}
            {mapHref && (
              <p className="flex items-center gap-2.5">
                <Map className="h-4 w-4 shrink-0 text-brand-red" />
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-red"
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
