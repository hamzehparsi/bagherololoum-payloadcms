'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Printer, QrCode } from 'lucide-react'

import { Button } from '@/components/ui/button'

type OccasionQrPanelProps = {
  title: string
  donateUrl: string
  siteName: string
}

export default function OccasionQrPanel({ title, donateUrl, siteName }: OccasionQrPanelProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    QRCode.toDataURL(donateUrl, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#00510a', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setError('ساخت QR با خطا روبه‌رو شد.')
      })

    return () => {
      cancelled = true
    }
  }, [donateUrl])

  function handleDownload() {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `qr-${title.replace(/\s+/g, '-')}.png`
    link.click()
  }

  function handlePrint() {
    if (!dataUrl) return
    window.print()
  }

  return (
    <section className="qr-print-area rounded-2xl border border-border bg-card p-5 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
      <div className="flex items-start gap-3 print:hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
          <QrCode className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold">کد QR پرداخت</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            این کد را چاپ کنید تا با اسکن مستقیم به صفحه پرداخت همین مناسبت بروند.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 print:mt-0">
        <div className="hidden text-center print:block">
          <h1 className="text-2xl font-bold text-brand-green">{title}</h1>
          <p className="mt-2 text-sm text-neutral-600">{siteName}</p>
        </div>

        {error && <p className="text-sm text-destructive print:hidden">{error}</p>}
        {!error && !dataUrl && (
          <div className="flex h-56 w-56 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground print:hidden">
            در حال ساخت QR...
          </div>
        )}
        {dataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={`کد QR پرداخت ${title}`}
            className="h-56 w-56 rounded-xl border border-border bg-white p-3 print:h-[280px] print:w-[280px] print:rounded-none print:border-0 print:p-0"
          />
        )}
        <p className="hidden max-w-sm text-sm leading-relaxed text-neutral-700 print:block">
          با اسکن این کد به صفحه پرداخت این مناسبت هدایت می‌شوید.
        </p>
        <p
          className="max-w-sm break-all text-center text-xs text-muted-foreground print:mt-2 print:text-[11px] print:text-neutral-500"
          dir="ltr"
        >
          {donateUrl}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row print:hidden">
        <Button type="button" onClick={handleDownload} disabled={!dataUrl} className="gap-1.5 sm:flex-1">
          <Download className="h-4 w-4" />
          دانلود تصویر QR
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handlePrint}
          disabled={!dataUrl}
          className="gap-1.5 sm:flex-1"
        >
          <Printer className="h-4 w-4" />
          چاپ
        </Button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .qr-print-area,
          .qr-print-area * {
            visibility: visible !important;
          }
          .qr-print-area {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            background: #fff !important;
            padding: 24px !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </section>
  )
}
