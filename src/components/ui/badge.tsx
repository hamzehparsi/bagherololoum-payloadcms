import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-brand-red text-brand-red-foreground [a]:hover:bg-brand-red/90",
        secondary:
          "bg-brand-green text-brand-green-foreground [a]:hover:bg-brand-green/90",
        destructive:
          "bg-brand-red/10 text-brand-red focus-visible:ring-brand-red/20 dark:bg-brand-red/20 dark:focus-visible:ring-brand-red/40 [a]:hover:bg-brand-red/15",
        outline:
          "border-brand-green/25 text-brand-green [a]:hover:bg-brand-green/5",
        ghost:
          "text-brand-green hover:bg-brand-green/8 dark:hover:bg-brand-green/12",
        link: "text-brand-red underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
