'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react'

import { cn } from '@/lib/utils'

export type GalleryLightboxImage = {
  id: string | number
  src: string
  fullSrc: string
  alt: string
  width?: number | null
  height?: number | null
  filename?: string | null
}

type GalleryLightboxProps = {
  images: GalleryLightboxImage[]
}

function isPortrait(image: GalleryLightboxImage): boolean {
  const width = image.width || 0
  const height = image.height || 0
  return height > 0 && width > 0 && height > width
}

async function downloadImage(image: GalleryLightboxImage) {
  const extension = image.filename?.split('.').pop() || 'jpg'
  const safeName =
    image.filename?.replace(/[^\w.\u0600-\u06FF-]+/g, '-') || `image-${image.id}.${extension}`

  try {
    const response = await fetch(image.fullSrc)
    if (!response.ok) throw new Error('download failed')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = safeName
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch {
    // fallback: open original in new tab if blob download fails
    window.open(image.fullSrc, '_blank', 'noopener,noreferrer')
  }
}

export default function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)
  const isOpen = activeIndex !== null
  const current = activeIndex !== null ? images[activeIndex] : null
  const currentPortrait = current ? isPortrait(current) : false

  const close = useCallback(() => setActiveIndex(null), [])

  const showPrev = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null || images.length === 0) return index
      return (index - 1 + images.length) % images.length
    })
  }, [images.length])

  const showNext = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null || images.length === 0) return index
      return (index + 1) % images.length
    })
  }, [images.length])

  const handleDownload = useCallback(async () => {
    if (!current || downloading) return
    setDownloading(true)
    try {
      await downloadImage(current)
    } finally {
      setDownloading(false)
    }
  }, [current, downloading])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') showPrev() // RTL: راست = قبلی
      if (event.key === 'ArrowLeft') showNext()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, close, showPrev, showNext])

  if (images.length === 0) return null

  return (
    <>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card text-right"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {isOpen && current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="نمایش تصویر"
          onClick={close}
        >
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                void handleDownload()
              }}
              disabled={downloading}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-3 text-sm text-white hover:bg-white/20 disabled:opacity-60"
              aria-label="دانلود تصویر"
            >
              <Download className="h-4 w-4" />
              {downloading ? 'در حال دانلود...' : 'دانلود'}
            </button>
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="بستن"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  showNext()
                }}
                className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
                aria-label="تصویر بعدی"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  showPrev()
                }}
                className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
                aria-label="تصویر قبلی"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-[88vh] max-w-[min(96vw,72rem)] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.fullSrc}
              alt={current.alt}
              width={current.width || (currentPortrait ? 900 : 1600)}
              height={current.height || (currentPortrait ? 1600 : 900)}
              sizes={currentPortrait ? '(max-width: 640px) 92vw, 560px' : '96vw'}
              className={cn(
                'h-auto max-h-[88vh] w-auto object-contain',
                currentPortrait ? 'max-w-[min(92vw,560px)]' : 'max-w-full',
              )}
              priority
            />
          </div>

          {images.length > 1 && activeIndex !== null && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {(activeIndex + 1).toLocaleString('fa-IR')} از {images.length.toLocaleString('fa-IR')}
            </p>
          )}
        </div>
      )}
    </>
  )
}
