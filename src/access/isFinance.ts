import type { Access } from 'payload'

export const isFinance: Access = ({ req }) => {
  const user = req.user
  if (!user) return false
  if ('role' in user) return user.role === 'finance' || user.role === 'super-admin'
  return false
}
