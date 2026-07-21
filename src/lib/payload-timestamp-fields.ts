import type { Field } from 'payload'

const jalaliDateCell = '@/components/admin/JalaliDateCell#JalaliDateCell'
const hiddenField = '@/components/admin/HiddenField#HiddenField'

export const jalaliTimestampFields: Field[] = [
  {
    name: 'createdAt',
    type: 'date',
    label: 'تاریخ ایجاد',
    admin: {
      components: {
        Cell: jalaliDateCell,
        Field: hiddenField,
      },
    },
  },
  {
    name: 'updatedAt',
    type: 'date',
    label: 'تاریخ به‌روزرسانی',
    admin: {
      components: {
        Cell: jalaliDateCell,
        Field: hiddenField,
      },
    },
  },
]
