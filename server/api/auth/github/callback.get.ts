import { upsertUser } from "#server/utils/db";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const storedState = getCookie(event, "github_oauth_state");
  if (!storedState || storedState !== query.state) {
    throw createError({ statusCode: 400, message: "Invalid OAuth state" });
  }
  deleteCookie(event, "github_oauth_state");

  const tokenRes = await $fetch<{ access_token?: string; error?: string }>(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: {
        client_id: config.githubClientId,
        client_secret: config.githubClientSecret,
        code: query.code,
        redirect_uri: `${config.public.siteUrl}/api/auth/github/callback`,
      },
    }
  );

  if (!tokenRes.access_token) {
    throw createError({
      statusCode: 401,
      message: tokenRes.error ?? "GitHub OAuth failed",
    });
  }

  const ghUser = await $fetch<{
    id: number;
    login: string;
    name: string | null;
    avatar_url: string;
  }>("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenRes.access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const { isNew, id } = upsertUser({
    github_id: ghUser.id,
    login: ghUser.login,
    name: ghUser.name,
    avatar_url: ghUser.avatar_url,
    access_token: tokenRes.access_token,
  });

  await setUserSession(event, {
    user: {
      id,
      login: ghUser.login,
      name: ghUser.name,
      avatarUrl: ghUser.avatar_url,
      isNew,
    },
  });

  return sendRedirect(event, isNew ? "/onboarding" : "/dashboard");
});
