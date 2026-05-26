import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'
import { scanFile, findingsToAnnotations } from './scanners'
import type { ScanFinding } from './scanners'

const SKIP_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.webp',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.zip',
  '.tar',
  '.gz',
  '.lock',
  '.min.js',
  '.min.css'
])

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

async function getChangedFiles(octokit: Octokit, owner: string, repo: string, sha: string) {
  const { data } = await octokit.repos.getCommit({ owner, repo, ref: sha })
  return (data.files ?? []).filter((f) => {
    const ext = '.' + f.filename.split('.').pop()
    return !SKIP_EXTENSIONS.has(ext) && f.status !== 'removed'
  })
}

async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  sha: string
): Promise<string | null> {
  try {
    const { data } = (await octokit.repos.getContent({ owner, repo, path, ref: sha })) as {
      data: { content?: string }
    }
    if ('content' in data && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf8')
    }
  } catch {
    return null
  }
  return null
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
  const [owner, repoName] = repo.split('/') as [string, string]
  const octokit = getOctokit(installationId)

  // start check run
  const { data: checkRun } = await octokit.checks.create({
    owner,
    repo: repoName,
    name: 'Void Shield Security Scan',
    head_sha: sha,
    status: 'in_progress'
  })

  const allFindings: ScanFinding[] = []

  try {
    const files = await getChangedFiles(octokit, owner, repoName, sha)

    for (const file of files) {
      const content = await getFileContent(octokit, owner, repoName, file.filename, sha)
      if (!content) continue
      const findings = scanFile(file.filename, content)
      allFindings.push(...findings)
    }
  } catch (err) {
    console.error('scan error:', err)
  }

  const annotations = findingsToAnnotations(allFindings)
  const critical = allFindings.filter(f => f.severity === 'critical').length
  const high = allFindings.filter(f => f.severity === 'high').length
  const total = allFindings.length

  const conclusion = total === 0 ? 'success' : critical > 0 || high > 0 ? 'failure' : 'neutral'

  const summary
    = total === 0
      ? 'No issues found.'
      : `Found ${total} issue${total === 1 ? '' : 's'}: ${critical} critical, ${high} high, ${allFindings.filter(f => f.severity === 'medium').length} medium.`

  await octokit.checks.update({
    owner,
    repo: repoName,
    check_run_id: checkRun.id,
    status: 'completed',
    conclusion,
    output: {
      title: total === 0 ? 'All clear' : `${total} security issue${total === 1 ? '' : 's'} found`,
      summary,
      annotations: annotations.slice(0, 50)
    }
  })
}
