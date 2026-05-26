import { describe, it, expect } from 'vitest'
import { scanFile } from '../server/utils/scanners'

describe('scanFile', () => {
  describe('env file detection', () => {
    it('flags .env committed and mentions rotation', () => {
      const findings = scanFile('.env', 'SECRET=abc123')
      const finding = findings.find(f => f.rule === 'env-file-committed')
      expect(finding).toBeDefined()
      expect(finding?.message).toContain('rotate')
    })

    it('flags .env.local committed', () => {
      const findings = scanFile('.env.local', 'SECRET=abc123')
      expect(findings.some(f => f.rule === 'env-file-committed')).toBe(true)
    })

    it('flags .env.production committed', () => {
      const findings = scanFile('.env.production', 'SECRET=abc123')
      expect(findings.some(f => f.rule === 'env-file-committed')).toBe(true)
    })

    it('does not flag regular files', () => {
      const findings = scanFile('src/config.ts', 'export const foo = "bar"')
      expect(findings.some(f => f.rule === 'env-file-committed')).toBe(false)
    })
  })

  describe('secret detection', () => {
    it('detects AWS access key', () => {
      const findings = scanFile('config.ts', 'const key = "AKIAIOSFODNN7EXAMPLE"')
      expect(findings.some(f => f.rule === 'hardcoded-secret')).toBe(true)
    })

    it('detects GitHub token', () => {
      const findings = scanFile('deploy.sh', 'TOKEN=ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890')
      expect(findings.some(f => f.rule === 'hardcoded-secret')).toBe(true)
    })

    it('detects private key header', () => {
      const findings = scanFile('key.ts', '-----BEGIN RSA PRIVATE KEY-----')
      expect(findings.some(f => f.rule === 'hardcoded-secret')).toBe(true)
    })

    it('detects Stripe live key', () => {
      const findings = scanFile('payments.ts', 'const sk = "sk_live_abcdefghijklmnopqrstuvwx"')
      expect(findings.some(f => f.rule === 'hardcoded-secret')).toBe(true)
    })

    it('skips commented lines', () => {
      const findings = scanFile('notes.ts', '// const key = "AKIAIOSFODNN7EXAMPLE"')
      expect(findings.some(f => f.rule === 'hardcoded-secret')).toBe(false)
    })

    it('does not flag clean code', () => {
      const findings = scanFile(
        'utils.ts',
        'export function add(a: number, b: number) { return a + b }'
      )
      expect(findings.some(f => f.rule === 'hardcoded-secret')).toBe(false)
    })
  })

  describe('internal IP detection', () => {
    it('detects 192.168.x.x', () => {
      const findings = scanFile('config.ts', 'const db = "192.168.1.100"')
      expect(findings.some(f => f.rule === 'internal-ip')).toBe(true)
    })

    it('detects 10.x.x.x', () => {
      const findings = scanFile('config.ts', 'const host = "10.0.0.5"')
      expect(findings.some(f => f.rule === 'internal-ip')).toBe(true)
    })

    it('does not flag public IPs', () => {
      const findings = scanFile('config.ts', 'const host = "8.8.8.8"')
      expect(findings.some(f => f.rule === 'internal-ip')).toBe(false)
    })
  })

  describe('severity', () => {
    it('marks env files as critical', () => {
      const findings = scanFile('.env', 'SECRET=abc')
      expect(findings.find(f => f.rule === 'env-file-committed')?.severity).toBe('critical')
    })

    it('marks secrets as critical', () => {
      const findings = scanFile('app.ts', 'const key = "AKIAIOSFODNN7EXAMPLE"')
      expect(findings.find(f => f.rule === 'hardcoded-secret')?.severity).toBe('critical')
    })

    it('marks internal IPs as medium', () => {
      const findings = scanFile('config.ts', 'const db = "192.168.1.1"')
      expect(findings.find(f => f.rule === 'internal-ip')?.severity).toBe('medium')
    })
  })
})
