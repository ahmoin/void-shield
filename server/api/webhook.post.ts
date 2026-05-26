export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const githubEvent = getHeader(event, 'x-github-event') ?? 'unknown'

  console.log(`received event: ${githubEvent}`)

  setResponseStatus(event, 200)
  return { ok: true, event: githubEvent }
})
