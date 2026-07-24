'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Check, Loader2 } from 'lucide-react'

import { updateAvatar, updateAvatarPreset } from '@/app/(frontend)/auth/actions/update-avatar'
import { AVATAR_PRESETS, avatarPresetUrl, type AvatarPreset } from '@/lib/media'
import { cn } from '@/lib/utils'

type ProfileAvatarUploaderProps = {
  currentUrl: string
  currentPreset?: string | null
  hasCustomAvatar: boolean
  displayName: string
}

export default function ProfileAvatarUploader({
  currentUrl,
  currentPreset,
  hasCustomAvatar,
  displayName,
}: ProfileAvatarUploaderProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const shownUrl = previewUrl || currentUrl

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(null)
    setPreviewUrl(URL.createObjectURL(file))

    const formData = new FormData()
    formData.set('avatar', file)

    startTransition(async () => {
      const result = await updateAvatar(formData)
      if (!result.success) {
        setError(result.error || 'خطا در بارگذاری')
        setPreviewUrl(null)
        return
      }
      setSuccess('تصویر پروفایل به‌روز شد.')
      router.refresh()
    })
  }

  function onPresetSelect(preset: AvatarPreset) {
    setError(null)
    setSuccess(null)
    setPreviewUrl(avatarPresetUrl(preset))

    startTransition(async () => {
      const result = await updateAvatarPreset(preset)
      if (!result.success) {
        setError(result.error || 'خطا در ذخیره قالب')
        setPreviewUrl(null)
        return
      }
      setSuccess('قالب رنگی پروفایل ذخیره شد.')
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shownUrl}
            alt={displayName}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-brand-green/10 shadow-md"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-white shadow-md transition-colors hover:bg-brand-green/90 disabled:opacity-60"
            aria-label="بارگذاری تصویر پروفایل"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
        <p className="text-sm font-semibold text-foreground">{displayName}</p>
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold text-brand-green">تصویر پروفایل</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          یکی از قالب‌های رنگی را انتخاب کنید یا با دکمه دوربین، تصویر خودتان را بارگذاری کنید.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {AVATAR_PRESETS.map((preset) => {
            const selected = !hasCustomAvatar && !previewUrl && preset === currentPreset
            return (
              <button
                key={preset}
                type="button"
                disabled={isPending}
                onClick={() => onPresetSelect(preset)}
                className={cn(
                  'relative h-12 w-12 overflow-hidden rounded-full transition-all disabled:opacity-60',
                  selected
                    ? 'ring-2 ring-brand-green ring-offset-2'
                    : 'hover:scale-110 hover:ring-2 hover:ring-brand-green/40 hover:ring-offset-2',
                )}
                aria-label={`انتخاب قالب ${preset}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarPresetUrl(preset)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {selected && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="h-5 w-5 text-white drop-shadow" />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
          className="mt-4 text-xs font-medium text-brand-red hover:underline disabled:opacity-60"
        >
          {isPending ? 'در حال ذخیره…' : 'بارگذاری تصویر شخصی'}
        </button>

        {error && <p className="mt-2 text-xs text-brand-red">{error}</p>}
        {success && !error && <p className="mt-2 text-xs text-brand-green">{success}</p>}
      </div>
    </div>
  )
}
