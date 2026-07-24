'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

type HomeWelcomeModalProps = {
  imageUrl: string
  imageAlt?: string
  link?: string | null
  openInNewTab?: boolean
}

export default function HomeWelcomeModal({
  imageUrl,
  imageAlt = '',
  link,
  openInNewTab,
}: HomeWelcomeModalProps) {
  const [open, setOpen] = useState(false)

  // Keyed by image URL so a new image shows again even if the old one was dismissed
  const storageKey = `home-popup-dismissed:${imageUrl}`

  useEffect(() => {
    if (!sessionStorage.getItem(storageKey)) {
      setOpen(true)
    }
  }, [storageKey])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function close() {
    sessionStorage.setItem(storageKey, '1')
    setOpen(false)
  }

  if (!open) return null

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={imageAlt}
      className="block max-h-[80vh] w-auto max-w-full rounded-2xl object-contain"
    />
  )

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={close}
    >
      <div className="relative" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={close}
          className="absolute -top-3 -left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-lg transition-colors hover:bg-brand-red hover:text-white"
          aria-label="بستن"
        >
          <X className="h-4 w-4" />
        </button>

        {link ? (
          <a
            href={link}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            onClick={() => sessionStorage.setItem(storageKey, '1')}
          >
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    </div>
  )
}
