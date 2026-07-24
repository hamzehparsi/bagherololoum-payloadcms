import type { Media } from '@/payload-types'

export const AVATAR_PRESETS = [
  'gradient-1',
  'gradient-2',
  'gradient-3',
  'gradient-4',
  'gradient-5',
  'gradient-6',
] as const

export type AvatarPreset = (typeof AVATAR_PRESETS)[number]

export const DEFAULT_AVATAR_PRESET: AvatarPreset = 'gradient-1'

export function avatarPresetUrl(preset?: string | null): string {
  const valid = AVATAR_PRESETS.includes(preset as AvatarPreset)
    ? (preset as AvatarPreset)
    : DEFAULT_AVATAR_PRESET
  return `/avatars/${valid}.svg`
}

export function resolveMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

export function resolveMediaAlt(media: number | Media | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}

type MediaSize = 'thumbnail' | 'avatar' | 'card' | 'hero'

export function resolveMediaSizeUrl(
  media: number | Media | null | undefined,
  size: MediaSize,
): string | null {
  if (!media || typeof media === 'number') return null
  return media.sizes?.[size]?.url || media.url || null
}

export function resolveDonorAvatarUrl(
  avatar: number | Media | null | undefined,
  preset?: string | null,
): string {
  return (
    resolveMediaSizeUrl(avatar, 'avatar') || resolveMediaUrl(avatar) || avatarPresetUrl(preset)
  )
}
