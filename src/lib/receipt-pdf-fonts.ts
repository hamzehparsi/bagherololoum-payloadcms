import path from 'path'

import { Font } from '@react-pdf/renderer'

let fontsRegistered = false

export function registerReceiptFonts() {
  if (fontsRegistered) return

  Font.register({
    family: 'Abar',
    fonts: [
      {
        src: path.join(process.cwd(), 'public/fonts/woff/AbarMidFaNum-Regular.woff'),
        fontWeight: 400,
      },
      {
        src: path.join(process.cwd(), 'public/fonts/woff/AbarMidFaNum-SemiBold.woff'),
        fontWeight: 600,
      },
      {
        src: path.join(process.cwd(), 'public/fonts/woff/AbarMidFaNum-Bold.woff'),
        fontWeight: 700,
      },
    ],
  })

  fontsRegistered = true
}
