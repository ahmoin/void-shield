import { createHmac, timingSafeEqual } from "node:crypto";

async function verifySignature(
  secret: string,
  signature: string | null,
  body: string,
): Promise<boolean> {
  if (!signature?.startsWith("sha256=")) return false;
  const sig = Buffer.from(signature);
  const digest = Buffer.from("sha256=" + createHmac("sha256", secret).update(body).digest("hex"));
  if (sig.length !== digest.length) return false;
  return timingSafeEqual(sig, digest);
}

export default defineEventHandler(async (event) => {
  const rawBody = (await readRawBody(event)) ?? "";
  const signature = getHeader(event, "x-hub-signature-256") ?? null;
  const githubEvent = getHeader(event, "x-github-event") ?? "unknown";
  const deliveryId = getHeader(event, "x-github-delivery") ?? "unknown";

  const secret = process.env.GITHUB_WEBHOOK_SECRET ?? "";
  const valid = await verifySignature(secret, signature, rawBody);

  if (!valid) {
    setResponseStatus(event, 401);
    return { error: "invalid signature" };
  }

  const payload = JSON.parse(rawBody);

  console.log(`event: ${githubEvent} delivery: ${deliveryId}`);

  if (githubEvent === "push" || githubEvent === "pull_request") {
    const repo = payload.repository?.full_name;
    const sha = payload.after ?? payload.pull_request?.head?.sha;
    console.log(`scan triggered: ${repo} @ ${sha}`);
  }

  setResponseStatus(event, 200);
  return { ok: true };
});
