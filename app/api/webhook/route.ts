import { createHmac, timingSafeEqual } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { createCheckRun } from "@/lib/github";

async function verifySignature(
  secret: string,
  signature: string | null,
  body: string
): Promise<boolean> {
  if (!signature?.startsWith("sha256=")) {
    return false;
  }
  const sig = Buffer.from(signature);
  const digest = Buffer.from(
    `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`
  );
  if (sig.length !== digest.length) {
    return false;
  }
  return timingSafeEqual(sig, digest);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const githubEvent = request.headers.get("x-github-event") ?? "unknown";
  const deliveryId = request.headers.get("x-github-delivery") ?? "unknown";

  const valid = await verifySignature(
    process.env.GITHUB_WEBHOOK_SECRET ?? "",
    signature,
    rawBody
  );

  if (!valid) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  console.log(`event: ${githubEvent} delivery: ${deliveryId}`);

  if (githubEvent === "push" || githubEvent === "pull_request") {
    const repo = payload.repository?.full_name;
    const sha = payload.after ?? payload.pull_request?.head?.sha;
    const installationId = payload.installation?.id;

    if (repo && sha && installationId) {
      console.log(`scan triggered: ${repo} @ ${sha}`);
      await createCheckRun({ repo, sha, installationId });
    }
  }

  return NextResponse.json({ ok: true });
}
