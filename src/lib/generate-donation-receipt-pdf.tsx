import React from 'react'

import { renderToBuffer } from '@react-pdf/renderer'

import type { DonationReceiptData } from '@/lib/donation-receipt-data'
import { DonationReceiptDocument } from '@/lib/donation-receipt-pdf'
import { registerReceiptFonts } from '@/lib/receipt-pdf-fonts'

export async function generateDonationReceiptPdf(data: DonationReceiptData): Promise<Buffer> {
  registerReceiptFonts()
  return renderToBuffer(<DonationReceiptDocument data={data} />)
}
