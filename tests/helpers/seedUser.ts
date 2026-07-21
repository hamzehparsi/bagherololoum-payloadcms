import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  name: 'Test Admin',
  email: 'dev@payloadcms.com',
  password: 'test',
  role: 'super-admin' as const,
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      name: {
        equals: testUser.name,
      },
    },
  })

  await payload.create({
    collection: 'users',
    data: testUser,
    draft: false,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      name: {
        equals: testUser.name,
      },
    },
  })
}
