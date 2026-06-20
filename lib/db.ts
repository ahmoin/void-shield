import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import {
  account,
  installation,
  session,
  user,
  verification,
} from "@/lib/db/schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema: { account, installation, session, user, verification },
});
