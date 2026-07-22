/** تولید slug از عنوان — با پشتیبانی حروف فارسی و عربی */
export function generateSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\u0750-\u077F\s-]/g, '') // پشتیبانی از حروف فارسی و عربی
    .replace(/[\s_]+/g, '-') // جایگزینی فاصله و underline با خط تیره
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .substring(0, 100) // محدود کردن طول slug
}

/** @deprecated از generateSlug استفاده کنید */
export const slugify = generateSlug
