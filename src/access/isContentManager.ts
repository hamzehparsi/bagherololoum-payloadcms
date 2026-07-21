import type { Access } from 'payload'

export const isContentManager: Access = ({ req }) => {
  const user = req.user
  if (!user || user.collection !== 'users') return false
  if (!('role' in user)) return false
  return user.role === 'super-admin' || user.role === 'editor'
}
