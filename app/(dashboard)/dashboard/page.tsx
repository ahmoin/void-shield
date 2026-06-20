import { eq } from "drizzle-orm";
import { ShieldOffIcon } from "lucide-react";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { db } from "@/lib/db";
import { installation } from "@/lib/db/schema";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const installations = await db.query.installation.findMany({
    where: eq(installation.userId, session!.user.id),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-2 font-semibold text-2xl">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Security scan results across your installed organizations.
      </p>

      {installations.length === 0 ? (
        <div className="py-20 text-center">
          <ShieldOffIcon className="mx-auto mb-4 size-12 text-muted-foreground/40" />
          <p className="mb-1 font-medium">No installations yet</p>
          <p className="mb-6 text-muted-foreground text-sm">
            Install {siteConfig.name} on a GitHub organization to start
            scanning.
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
      ) : (
        <div className="grid gap-3">
          {installations.map((inst) => (
            <div
              className="flex items-center gap-4 rounded-xl border bg-card p-5"
              key={inst.id}
            >
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-sm">
                {inst.accountLogin.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{inst.accountLogin}</p>
                <p className="text-muted-foreground text-sm">
                  {inst.accountType}
                </p>
              </div>
              <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 font-medium text-green-600 text-xs dark:text-green-400">
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
