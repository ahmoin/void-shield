import Database from "better-sqlite3";
import { join } from "path";

let _db: ReturnType<typeof Database> | null = null;

export function getDb() {
  if (_db) {
    return _db;
  }

  _db = new Database(join(process.cwd(), "void-shield.db"));
  _db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      github_id INTEGER UNIQUE NOT NULL,
      login TEXT NOT NULL,
      name TEXT,
      avatar_url TEXT,
      access_token TEXT NOT NULL,
      created_at INTEGER DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS installations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      installation_id INTEGER UNIQUE NOT NULL,
      account_login TEXT NOT NULL,
      account_type TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      created_at INTEGER DEFAULT (unixepoch()),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  return _db;
}

export interface DbUser {
  access_token: string;
  avatar_url: string | null;
  created_at: number;
  github_id: number;
  id: number;
  login: string;
  name: string | null;
}

export interface DbInstallation {
  account_login: string;
  account_type: string;
  created_at: number;
  id: number;
  installation_id: number;
  user_id: number;
}

export function upsertUser(
  data: Omit<DbUser, "id" | "created_at">
): DbUser & { isNew: boolean } {
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM users WHERE github_id = ?")
    .get(data.github_id) as DbUser | undefined;

  if (existing) {
    db.prepare(
      "UPDATE users SET login = ?, name = ?, avatar_url = ?, access_token = ? WHERE github_id = ?"
    ).run(
      data.login,
      data.name,
      data.avatar_url,
      data.access_token,
      data.github_id
    );
    return { ...existing, ...data, isNew: false };
  }

  const result = db
    .prepare(
      "INSERT INTO users (github_id, login, name, avatar_url, access_token) VALUES (?, ?, ?, ?, ?)"
    )
    .run(
      data.github_id,
      data.login,
      data.name,
      data.avatar_url,
      data.access_token
    );

  return {
    id: result.lastInsertRowid as number,
    created_at: Math.floor(Date.now() / 1000),
    ...data,
    isNew: true,
  };
}

export function upsertInstallation(
  data: Omit<DbInstallation, "id" | "created_at">
) {
  const db = getDb();
  db.prepare(`
    INSERT INTO installations (installation_id, account_login, account_type, user_id)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(installation_id) DO UPDATE SET account_login = excluded.account_login, user_id = excluded.user_id
  `).run(
    data.installation_id,
    data.account_login,
    data.account_type,
    data.user_id
  );
}

export function getUserInstallations(userId: number): DbInstallation[] {
  return getDb()
    .prepare("SELECT * FROM installations WHERE user_id = ?")
    .all(userId) as DbInstallation[];
}
