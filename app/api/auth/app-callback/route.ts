import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { installation } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const installationId = Number(
    request.nextUrl.searchParams.get("installation_id")
  );
  if (!installationId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const { createAppAuth } = await import("@octokit/auth-app");
  const { Octokit } = await import("@octokit/rest");

  const privateKey = Buffer.from(
    process.env.GITHUB_PRIVATE_KEY ?? "",
    "base64"
  ).toString("utf8");

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: { appId: process.env.GITHUB_APP_ID!, privateKey },
  });

  const { data: inst } = await octokit.apps.getInstallation({
    installation_id: installationId,
  });
  const ghAccount = inst.account as { login?: string; type?: string } | null;

  await db
    .insert(installation)
    .values({
      installationId,
      accountLogin: ghAccount?.login ?? "",
      accountType: ghAccount?.type ?? "User",
      userId: session.user.id,
    })
    .onConflictDoUpdate({
      target: installation.installationId,
      set: {
        accountLogin: ghAccount?.login ?? "",
        userId: session.user.id,
      },
    });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
