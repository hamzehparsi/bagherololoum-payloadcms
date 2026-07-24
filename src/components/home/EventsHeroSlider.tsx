'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type EventHeroSlide = {
  id: number | string
  title: string
  excerpt?: string | null
  href?: string | null
  imageUrl?: string | null
  imageAlt: string
  dateLabel?: string | null
}

type EventsHeroSliderProps = {
  slides: EventHeroSlide[]
  autoPlayMs?: number
}

export default function EventsHeroSlider({ slides, autoPlayMs = 6000 }: EventsHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const count = slides.length
  const hasMultiple = count > 1

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return
      setActiveIndex(((index % count) + count) % count)
    },
    [count],
  )

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  useEffect(() => {
    if (!hasMultiple || isPaused) return
    const timer = window.setInterval(goNext, autoPlayMs)
    return () => window.clearInterval(timer)
  }, [hasMultiple, isPaused, goNext, autoPlayMs])

  useEffect(() => {
    if (activeIndex >= count && count > 0) setActiveIndex(0)
  }, [activeIndex, count])

  if (count === 0) return null

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    if (Math.abs(delta) > 48) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  return (
    <section
      className="relative isolate h-[min(78vh,720px)] w-full overflow-hidden border-b border-border bg-stone-900"
      aria-roledescription="carousel"
      aria-label="اسلایدر رویدادها"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex
        return (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-all duration-700 ease-out',
              isActive ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-[1.03]',
            )}
            aria-hidden={!isActive}
          >
            {slide.imageUrl ? (
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-brand-green/80 to-stone-900" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
          </div>
        )
      })}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-16 text-center sm:px-8">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={`content-${slide.id}`}
              className={cn(
                'absolute inset-x-4 top-1/2 flex max-w-3xl -translate-y-1/2 flex-col items-center transition-all duration-700 sm:inset-x-auto',
                isActive
                  ? 'translate-y-[-50%] opacity-100'
                  : 'pointer-events-none translate-y-[calc(-50%+12px)] opacity-0',
              )}
              aria-hidden={!isActive}
            >
              {slide.dateLabel && (
                <p className="mb-3 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                  {slide.dateLabel}
                </p>
              )}
              <h2 className="text-2xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                {slide.title}
              </h2>
              {slide.excerpt && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  {slide.excerpt}
                </p>
              )}
              {slide.href && (
                <Link
                  href={slide.href}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'mt-8 gap-2 px-6',
                  )}
                >
                  مشاهده رویداد
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goNext}
            className="absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red/70 text-white backdrop-blur-sm transition hover:bg-brand-red sm:right-6"
            aria-label="اسلاید بعدی"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goPrev}
            className="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red/70 text-white backdrop-blur-sm transition hover:bg-brand-red sm:left-6"
            aria-label="اسلاید قبلی"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.id}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`رفتن به اسلاید ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300',
                  index === activeIndex
                    ? 'w-8 bg-brand-red'
                    : 'w-2.5 bg-white/45 hover:bg-brand-red/70',
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
