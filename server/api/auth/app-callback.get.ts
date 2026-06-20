import { upsertInstallation } from "#server/utils/db";

// GitHub redirects here after app install with ?installation_id=&setup_action=install
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await getUserSession(event);

  if (!session.user) {
    return sendRedirect(event, "/login");
  }

  const installationId = Number(query.installation_id);
  if (isNaN(installationId) || installationId === 0) {
    throw createError({ statusCode: 400, message: "Missing installation_id" });
  }

  // Fetch installation info using the GitHub App JWT
  const { createAppAuth } = await import("@octokit/auth-app");
  const { Octokit } = await import("@octokit/rest");
  const privateKey = Buffer.from(
    process.env.GITHUB_PRIVATE_KEY ?? "",
    "base64"
  ).toString("utf8");

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey,
    },
  });

  const { data: installation } = await octokit.apps.getInstallation({
    installation_id: installationId,
  });

  const account = installation.account as {
    login?: string;
    type?: string;
  } | null;
  upsertInstallation({
    installation_id: installationId,
    account_login: account?.login ?? "",
    account_type: account?.type ?? "User",
    user_id: session.user.id,
  });

  await setUserSession(event, {
    user: { ...session.user, isNew: false },
  });

  return sendRedirect(event, "/dashboard");
});
