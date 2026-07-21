import crypto from 'crypto'
import type { CollectionBeforeValidateHook } from 'payload'

import { generateRandomPassword } from '@/lib/otp-security'

export const donorBeforeValidate: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (operation === 'create' && data && !data.password) {
    data.password = generateRandomPassword()
  }
  return data
}
