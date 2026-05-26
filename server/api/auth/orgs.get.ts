import { getDb } from '#server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const dbUser = getDb().prepare('SELECT access_token FROM users WHERE id = ?').get(session.user.id) as
    | { access_token: string }
    | undefined

  if (!dbUser) throw createError({ statusCode: 401, message: 'User not found' })

  const orgs = await $fetch<{ id: number, login: string, avatar_url: string }[]>(
    'https://api.github.com/user/orgs',
    {
      headers: {
        Authorization: `Bearer ${dbUser.access_token}`,
        Accept: 'application/vnd.github+json'
      }
    }
  )

  return {
    personal: {
      id: session.user.id,
      login: session.user.login,
      avatarUrl: session.user.avatarUrl,
      type: 'User'
    },
    orgs: orgs.map(o => ({ id: o.id, login: o.login, avatarUrl: o.avatar_url, type: 'Organization' }))
  }
})
