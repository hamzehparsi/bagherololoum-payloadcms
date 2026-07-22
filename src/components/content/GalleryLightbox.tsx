'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type GalleryLightboxImage = {
  id: string | number
  src: string
  fullSrc: string
  alt: string
}

type GalleryLightboxProps = {
  images: GalleryLightboxImage[]
}

export default function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isOpen = activeIndex !== null
  const current = activeIndex !== null ? images[activeIndex] : null

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
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          <button
            type="button"
            onClick={close}
            className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="بستن"
          >
            <X className="h-5 w-5" />
          </button>

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
            className="relative h-[min(85vh,900px)] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.fullSrc}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain"
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
