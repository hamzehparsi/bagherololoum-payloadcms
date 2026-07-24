'use client'

import { PopupList } from '@payloadcms/ui'

export function DonationsExportButton() {
  return (
    <PopupList.Button
      id="donations-export-csv"
      onClick={() => {
        window.location.href = '/api/donations/export-csv'
      }}
    >
      دانلود CSV
    </PopupList.Button>
  )
}
