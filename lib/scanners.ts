const SECRET_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: "AWS Access Key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "AWS Secret Key", pattern: /aws_secret_access_key\s*=\s*[^\s]+/i },
  { name: "GitHub Token", pattern: /gh[pousr]_[A-Za-z0-9]{36,}/ },
  {
    name: "Generic API Key",
    pattern: /api[_-]?key\s*[:=]\s*['"]?[A-Za-z0-9\-_]{20,}['"]?/i,
  },
  {
    name: "Private Key Header",
    pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
  },
  { name: "Stripe Key", pattern: /sk_(live|test)_[A-Za-z0-9]{24,}/ },
  {
    name: "Hardcoded Password",
    pattern: /password\s*[:=]\s*['"][^'"]{6,}['"]/i,
  },
];

const ENV_FILE_PATTERNS = [
  /^\.env$/,
  /^\.env\.(local|production|staging|development|prod|dev)$/,
  /^\.env\.\w+\.local$/,
];

const INTERNAL_IP_PATTERN =
  /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/;

export interface ScanFinding {
  line?: number;
  message: string;
  path: string;
  rule: string;
  severity: "critical" | "high" | "medium" | "low";
}

export function scanFile(
  path: string,
  content: string,
  ignorePaths: RegExp[] = []
): ScanFinding[] {
  if (ignorePaths.some((p) => p.test(path))) {
    return [];
  }

  const findings: ScanFinding[] = [];
  const filename = path.split("/").pop() ?? path;

  if (ENV_FILE_PATTERNS.some((p) => p.test(filename))) {
    findings.push({
      path,
      rule: "env-file-committed",
      severity: "critical",
      message: `${filename} committed — rotate all secrets inside immediately, then add to .gitignore.`,
    });
  }

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const lineNum = i + 1;

    if (/^\s*(#|\/\/|\/\*)/.test(line)) {
      continue;
    }

    for (const { name, pattern } of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        findings.push({
          path,
          line: lineNum,
          rule: "hardcoded-secret",
          severity: "critical",
          message: `Possible ${name} detected — rotate this credential immediately and use environment variables instead.`,
        });
        break;
      }
    }

    if (INTERNAL_IP_PATTERN.test(line)) {
      findings.push({
        path,
        line: lineNum,
        rule: "internal-ip",
        severity: "medium",
        message: `Internal IP address hardcoded on line ${lineNum}`,
      });
    }
  }

  return findings;
}

export function findingsToAnnotations(findings: ScanFinding[]) {
  return findings
    .filter((f) => f.line !== undefined)
    .map((f) => ({
      path: f.path,
      start_line: f.line as number,
      end_line: f.line as number,
      annotation_level:
        f.severity === "critical" || f.severity === "high"
          ? ("failure" as const)
          : ("warning" as const),
      message: f.message,
      title: f.rule,
    }));
}
