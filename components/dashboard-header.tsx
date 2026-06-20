"use client";

import { LogOutIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { siteConfig } from "@/lib/config";

export function DashboardHeader({
  user,
}: {
  user: {
    name: string;
    image?: string | null;
    githubLogin?: string | null;
  };
}) {
  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/">
        <Icons.logoFull className="h-4" />
      </Link>
      <div className="flex items-center gap-3">
        <Button asChild size="sm" variant="outline">
          <a
            href={`${siteConfig.links.githubApp}/installations/new`}
            rel="noopener"
            target="_blank"
          >
            <PlusIcon className="size-3.5" />
            Add organization
          </a>
        </Button>
        <div className="flex items-center gap-2">
          {user.image && (
            <Image
              alt={user.name}
              className="size-8 rounded-full ring-2 ring-border"
              height={32}
              src={user.image}
              width={32}
            />
          )}
          <Button onClick={signOut} size="icon" variant="ghost">
            <LogOutIcon className="size-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
