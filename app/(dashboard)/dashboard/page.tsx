import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { eq } from "drizzle-orm";
import { GitForkIcon, LockIcon, ShieldOffIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { db } from "@/lib/db";
import { installation } from "@/lib/db/schema";

async function getReposForInstallation(installationId: number) {
  const privateKey = Buffer.from(
    process.env.GITHUB_PRIVATE_KEY ?? "",
    "base64"
  ).toString("utf8");

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID ?? "",
      privateKey,
      installationId,
    },
  });

  const { data } = await octokit.apps.listReposAccessibleToInstallation({
    per_page: 100,
  });

  return data.repositories;
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const installations = await db.query.installation.findMany({
    where: eq(installation.userId, session?.user.id ?? ""),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  if (installations.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-2 font-semibold text-2xl">Dashboard</h1>
        <p className="mb-8 text-muted-foreground">
          Security scan results across your installed organizations.
        </p>
        <div className="py-20 text-center">
          <ShieldOffIcon className="mx-auto mb-4 size-12 text-muted-foreground/40" />
          <p className="mb-1 font-medium">No installations yet</p>
          <p className="mb-6 text-muted-foreground text-sm">
            Install {siteConfig.name} on a GitHub account to start scanning.
          </p>
          <Button asChild>
            <a
              href={`${siteConfig.links.githubApp}/installations/new`}
              rel="noopener"
              target="_blank"
            >
              Install Void Shield
            </a>
          </Button>
        </div>
      </main>
    );
  }

  const installationsWithRepos = await Promise.all(
    installations.map(async (inst) => {
      const repos = await getReposForInstallation(inst.installationId);
      return { ...inst, repos };
    })
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-2 font-semibold text-2xl">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Security scan results across your installed organizations.
      </p>

      <div className="space-y-6">
        {installationsWithRepos.map((inst) => (
          <div key={inst.id}>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-sm">
                {inst.accountLogin.slice(0, 1).toUpperCase()}
              </div>
              <span className="font-medium">{inst.accountLogin}</span>
              <span className="text-muted-foreground text-sm">
                {inst.accountType}
              </span>
              <span className="ml-auto rounded-full bg-green-500/10 px-2.5 py-0.5 font-medium text-green-600 text-xs dark:text-green-400">
                Active
              </span>
            </div>

            {inst.repos.length === 0 ? (
              <p className="rounded-lg border border-dashed px-4 py-6 text-center text-muted-foreground text-sm">
                No repositories selected for this installation.
              </p>
            ) : (
              <div className="grid gap-2">
                {inst.repos.map((repo) => (
                  <div
                    className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
                    key={repo.id}
                  >
                    {repo.private ? (
                      <LockIcon className="size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <GitForkIcon className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">
                        {repo.full_name}
                      </p>
                      {repo.description && (
                        <p className="truncate text-muted-foreground text-xs">
                          {repo.description}
                        </p>
                      )}
                    </div>
                    <Link
                      className="ml-auto shrink-0 text-muted-foreground text-xs hover:text-primary"
                      href={`/dashboard/repo/${repo.full_name}`}
                    >
                      View scan →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
