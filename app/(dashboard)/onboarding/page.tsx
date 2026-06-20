"use client";

import { ArrowRightIcon, BuildingIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

interface GithubTarget {
  avatarUrl: string;
  id: number;
  login: string;
  type: string;
}

interface OrgsResponse {
  orgs: GithubTarget[];
  personal: GithubTarget;
}

export default function OnboardingPage() {
  const [data, setData] = useState<OrgsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github/orgs")
      .then((r) => r.json())
      .then((d: OrgsResponse) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function installUrl(id: number, type: string) {
    const targetType = type === "Organization" ? "Organization" : "User";
    return `${siteConfig.links.githubApp}/installations/new?target_id=${id}&target_type=${targetType}`;
  }

  const targets = data ? [data.personal, ...data.orgs] : [];

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="mb-2 font-semibold text-2xl">Choose an account</h1>
      <p className="mb-8 text-muted-foreground">
        Install {siteConfig.name} on your personal account or an organization to
        start scanning repositories.
      </p>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              className="h-16 animate-pulse rounded-xl border bg-muted"
              key={i}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {targets.map((t) => (
            <a
              className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              href={installUrl(t.id, t.type)}
              key={t.id}
              rel="noopener"
              target="_blank"
            >
              <img
                alt={t.login}
                className="size-9 rounded-full"
                src={t.avatarUrl}
              />
              <div className="flex-1">
                <p className="font-medium">{t.login}</p>
                <p className="flex items-center gap-1 text-muted-foreground text-xs">
                  {t.type === "Organization" ? (
                    <BuildingIcon className="size-3" />
                  ) : (
                    <UserIcon className="size-3" />
                  )}
                  {t.type}
                </p>
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
