import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { account } from "@/lib/db/schema";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userAccount = await db.query.account.findFirst({
    where: and(
      eq(account.userId, session.user.id),
      eq(account.providerId, "github")
    ),
  });

  if (!userAccount?.accessToken) {
    return NextResponse.json(
      { error: "No GitHub account linked" },
      { status: 401 }
    );
  }

  const ghHeaders = {
    Authorization: `Bearer ${userAccount.accessToken}`,
    Accept: "application/vnd.github+json",
  };

  const [ghUser, ghOrgs] = await Promise.all([
    fetch("https://api.github.com/user", { headers: ghHeaders }).then((r) =>
      r.json()
    ),
    fetch("https://api.github.com/user/orgs", { headers: ghHeaders }).then(
      (r) => r.json()
    ),
  ]);

  return NextResponse.json({
    personal: {
      id: ghUser.id as number,
      login: ghUser.login as string,
      avatarUrl: ghUser.avatar_url as string,
      type: "User",
    },
    orgs: (ghOrgs as { id: number; login: string; avatar_url: string }[]).map(
      (o) => ({
        id: o.id,
        login: o.login,
        avatarUrl: o.avatar_url,
        type: "Organization",
      })
    ),
  });
}
