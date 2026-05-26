import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'

function getOctokit(installationId: number) {
  const privateKey = Buffer.from(process.env.GITHUB_PRIVATE_KEY ?? '', 'base64').toString('utf8')

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey,
      installationId
    }
  })
}

export async function createCheckRun({
  repo,
  sha,
  installationId
}: {
  repo: string
  sha: string
  installationId: number
}) {
  const [owner, repoName] = repo.split('/')
  const octokit = getOctokit(installationId)

  await octokit.checks.create({
    owner,
    repo: repoName,
    name: 'Void Shield Security Scan',
    head_sha: sha,
    status: 'completed',
    conclusion: 'neutral',
    output: {
      title: 'Void Shield',
      summary: 'Security scan coming soon.'
    }
  })
}
