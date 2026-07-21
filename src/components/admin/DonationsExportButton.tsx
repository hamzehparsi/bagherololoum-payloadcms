'use client'

import { useState } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

const inputStyle: React.CSSProperties = {
  height: '36px',
  padding: '0 10px',
  fontSize: '13px',
  fontFamily: 'inherit',
  background: 'var(--theme-input-bg)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '8px',
  color: 'var(--theme-elevation-800)',
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '12px',
  color: 'var(--theme-elevation-500)',
}

const statusOptions = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'success', label: 'موفق' },
  { value: 'pending', label: 'در انتظار پرداخت' },
  { value: 'failed', label: 'ناموفق' },
  { value: 'expired', label: 'منقضی‌شده' },
]

export function DonationsExportButton() {
  const [from, setFrom] = useState<DateObject | null>(null)
  const [to, setTo] = useState<DateObject | null>(null)
  const [status, setStatus] = useState('')

  const handleDownload = () => {
    const params = new URLSearchParams()

    if (from) {
      const start = new Date(from.toDate())
      start.setHours(0, 0, 0, 0)
      params.set('from', start.toISOString())
    }
    if (to) {
      const end = new Date(to.toDate())
      end.setHours(23, 59, 59, 999)
      params.set('to', end.toISOString())
    }
    if (status) params.set('status', status)

    const query = params.toString()
    window.location.href = `/api/donations/export-csv${query ? `?${query}` : ''}`
  }

  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '14px 16px',
        borderRadius: '12px',
        background: 'var(--theme-elevation-50)',
        border: '1px solid var(--theme-elevation-100)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: '12px',
      }}
    >
      <label style={labelStyle}>
        از تاریخ
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          value={from}
          onChange={setFrom}
          format="YYYY/MM/DD"
          placeholder="ابتدای بازه"
          editable={false}
          style={{ ...inputStyle, width: '130px' }}
        />
      </label>

      <label style={labelStyle}>
        تا تاریخ
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          value={to}
          onChange={setTo}
          format="YYYY/MM/DD"
          placeholder="انتهای بازه"
          editable={false}
          style={{ ...inputStyle, width: '130px' }}
        />
      </label>

      <label style={labelStyle}>
        وضعیت
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          style={{ ...inputStyle, width: '150px' }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={handleDownload}
        style={{
          height: '36px',
          padding: '0 16px',
          borderRadius: '8px',
          border: 'none',
          background: 'var(--theme-elevation-800)',
          color: 'var(--theme-elevation-0)',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        دانلود CSV
      </button>

      {(from || to || status) && (
        <button
          type="button"
          onClick={() => {
            setFrom(null)
            setTo(null)
            setStatus('')
          }}
          style={{
            height: '36px',
            padding: '0 10px',
            borderRadius: '8px',
            border: 'none',
            background: 'none',
            color: 'var(--theme-elevation-500)',
            fontSize: '12px',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          پاک کردن فیلترها
        </button>
      )}
    </div>
  )
}
