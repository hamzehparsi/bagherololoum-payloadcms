import type { Field } from 'payload'

const jalaliDateCell = '@/components/admin/JalaliDateCell#JalaliDateCell'
const hiddenField = '@/components/admin/HiddenField#HiddenField'

export const jalaliTimestampFields: Field[] = [
  {
    name: 'createdAt',
    type: 'date',
    label: 'تاریخ ایجاد',
    admin: {
      date: {
        pickerAppearance: 'dayOnly',
        displayFormat: 'yyyy/MM/dd',
      },
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
      date: {
        pickerAppearance: 'dayOnly',
        displayFormat: 'yyyy/MM/dd',
      },
      components: {
        Cell: jalaliDateCell,
        Field: hiddenField,
      },
    },
  },
]
