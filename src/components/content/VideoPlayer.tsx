'use client'

import { useEffect, useRef, useState } from 'react'
import type Player from 'video.js/dist/types/player'
import { Maximize2, X } from 'lucide-react'

import { cn } from '@/lib/utils'

import 'video.js/dist/video-js.css'

type VideoPlayerProps = {
  src: string
  poster?: string | null
  title?: string
}

/**
 * پلیر Video.js با حالت شناور: وقتی ویدیو در حال پخش از دید خارج شود،
 * کوچک شده و گوشه صفحه فیکس می‌ماند.
 */
export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const videoHostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [outOfView, setOutOfView] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [ready, setReady] = useState(false)

  const floating = isPlaying && outOfView && !dismissed

  useEffect(() => {
    const host = videoHostRef.current
    if (!host) return

    let disposed = false
    let player: Player | null = null

    async function init() {
      const videojs = (await import('video.js')).default
      if (disposed || !videoHostRef.current) return

      // المان تازه تا React Strict Mode / dispose مشکلی نسازد
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered', 'vjs-fill')
      videoHostRef.current.replaceChildren(videoElement)

      player = videojs(videoElement, {
        controls: true,
        autoplay: false,
        preload: 'metadata',
        fill: true,
        playsinline: true,
        language: 'fa',
        controlBar: {
          pictureInPictureToggle: false,
        },
        sources: [{ src, type: guessMimeType(src) }],
        poster: poster || undefined,
      })

      player.ready(() => {
        if (disposed) return
        player?.el().setAttribute('dir', 'ltr')
        setReady(true)
      })

      player.on('play', () => setIsPlaying(true))
      player.on('pause', () => setIsPlaying(false))
      player.on('ended', () => setIsPlaying(false))
      player.on('error', () => {
        // اگر video.js خطا داد، حداقل native video نشان بده
        if (disposed || !videoHostRef.current) return
        showNativeFallback(videoHostRef.current, src, poster)
      })

      playerRef.current = player
    }

    void init()

    return () => {
      disposed = true
      setReady(false)
      if (player && !player.isDisposed()) {
        player.dispose()
      }
      playerRef.current = null
    }
  }, [src, poster])

  useEffect(() => {
    const placeholder = placeholderRef.current
    if (!placeholder) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOutOfView(!entry.isIntersecting)
        if (entry.isIntersecting) setDismissed(false)
      },
      { threshold: 0.2 },
    )

    observer.observe(placeholder)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const player = playerRef.current
    if (!player || player.isDisposed()) return
    requestAnimationFrame(() => {
      try {
        player.trigger('resize')
      } catch {
        /* ignore */
      }
    })
  }, [floating])

  return (
    <div
      ref={placeholderRef}
      className="relative aspect-video w-full"
      aria-label={title}
    >
      <div
        className={cn(
          'site-video-player overflow-hidden bg-black shadow-lg transition-all duration-300',
          floating
            ? 'fixed bottom-4 left-4 z-[90] aspect-video w-[min(20rem,calc(100vw-2rem))] rounded-xl ring-1 ring-black/25'
            : 'absolute inset-0 rounded-2xl',
        )}
      >
        {floating && (
          <div className="absolute top-2 inset-x-2 z-[100] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-brand-red"
              aria-label="بستن پلیر کوچک"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                placeholderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                setDismissed(false)
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-brand-green"
              aria-label="بازگشت به ویدیو"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-sm text-white/70">
            در حال آماده‌سازی پخش‌کننده…
          </div>
        )}

        <div ref={videoHostRef} data-vjs-player className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  )
}

function guessMimeType(src: string): string {
  const path = src.split('?')[0]?.toLowerCase() || ''
  if (path.endsWith('.webm')) return 'video/webm'
  if (path.endsWith('.ogg') || path.endsWith('.ogv')) return 'video/ogg'
  if (path.endsWith('.mov')) return 'video/quicktime'
  return 'video/mp4'
}

function showNativeFallback(
  host: HTMLDivElement,
  src: string,
  poster?: string | null,
) {
  host.replaceChildren()
  const video = document.createElement('video')
  video.src = src
  if (poster) video.poster = poster
  video.controls = true
  video.playsInline = true
  video.className = 'h-full w-full object-contain bg-black'
  host.appendChild(video)
}
