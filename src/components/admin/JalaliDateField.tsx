'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import type { DateFieldClientComponent } from 'payload'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

export const JalaliDateField: DateFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string | null>({ path })

  const label = typeof field.label === 'string' ? field.label : field.name

  return (
    <div className="field-type date-time-field" style={{ marginBottom: 'var(--base)' }}>
      <FieldLabel label={label} required={field.required} path={path} />
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        value={value ? new Date(value) : null}
        onChange={(date) => {
          if (!date) {
            setValue(null)
            return
          }
          const selected = Array.isArray(date) ? date[0] : date
          setValue(selected instanceof DateObject ? selected.toDate().toISOString() : null)
        }}
        format="YYYY/MM/DD"
        placeholder="انتخاب تاریخ"
        editable={false}
        style={{
          width: '100%',
          height: '40px',
          padding: '0 12px',
          fontSize: '14px',
          fontFamily: 'inherit',
          background: 'var(--theme-input-bg)',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 'var(--style-radius-s)',
          color: 'var(--theme-elevation-800)',
        }}
        containerStyle={{ width: '100%' }}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue(null)}
          style={{
            marginTop: '4px',
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '12px',
            color: 'var(--theme-elevation-500)',
            cursor: 'pointer',
          }}
        >
          پاک کردن تاریخ
        </button>
      )}
    </div>
  )
}

export default JalaliDateField
