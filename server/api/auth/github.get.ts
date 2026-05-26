export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  const state = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  setCookie(event, 'github_oauth_state', state, { httpOnly: true, maxAge: 600, sameSite: 'lax' })

  const params = new URLSearchParams({
    client_id: config.githubClientId,
    scope: 'read:user read:org',
    state,
    redirect_uri: `${config.public.siteUrl}/api/auth/github/callback`
  })

  return sendRedirect(event, `https://github.com/login/oauth/authorize?${params}`)
})
