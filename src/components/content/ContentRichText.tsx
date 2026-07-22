import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'

type ContentRichTextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  className?: string
}

export default function ContentRichText({ data, className }: ContentRichTextProps) {
  if (!data) return null

  return (
    <div
      className={cn(
        'content-richtext space-y-4 text-sm leading-8 text-foreground/90 sm:text-base',
        '[&_h1]:text-2xl [&_h1]:font-black [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold',
        '[&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline',
        '[&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5',
        '[&_blockquote]:border-r-4 [&_blockquote]:border-primary/30 [&_blockquote]:pr-4 [&_blockquote]:text-muted-foreground',
        '[&_img]:rounded-xl [&_img]:max-w-full',
        className,
      )}
    >
      <PayloadRichText data={data} />
    </div>
  )
}
