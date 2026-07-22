'use client'

type AudioPlayerProps = {
  src: string
  title?: string
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      {title && <p className="mb-3 text-sm font-medium">{title}</p>}
      <audio controls preload="metadata" className="w-full" src={src}>
        مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
      </audio>
    </div>
  )
}
