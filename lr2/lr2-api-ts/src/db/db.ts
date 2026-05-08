import { mkdir } from "node:fs/promises";
import path from "node:path";
import sqlite3 from "sqlite3";
import { config } from "../config.js";

let db: sqlite3.Database | null = null;

export type RunResult = {
  changes: number;
  lastID: number;
};

function ensureDb(): sqlite3.Database {
  if (!db) {
    throw new Error("Database connection has not been initialized");
  }

  return db;
}

export function getDb(): sqlite3.Database {
  return ensureDb();
}

export async function initDb(): Promise<void> {
  if (db) {
    return;
  }

  const absoluteDbPath = path.resolve(config.dbPath);
  const dbDirectory = path.dirname(absoluteDbPath);

  await mkdir(dbDirectory, { recursive: true });

  db = await new Promise<sqlite3.Database>((resolve, reject) => {
    const instance = new sqlite3.Database(absoluteDbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(instance);
    });
  });

  db.configure("busyTimeout", 3000);

  await new Promise<void>((resolve, reject) => {
    ensureDb().exec("PRAGMA foreign_keys = ON;", (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

  console.log(`DB connected: ${absoluteDbPath}`);
}

export function run(sql: string, params: unknown[] = []): Promise<RunResult> {
  return new Promise<RunResult>((resolve, reject) => {
   ensureDb().run(sql, params, function(this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        changes: this.changes ?? 0,
        lastID: Number(this.lastID ?? 0),
      });
    });
  });
}

export function get<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    ensureDb().get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve((row as T | undefined) ?? null);
    });
  });
}

export function all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    ensureDb().all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve((rows as T[] | undefined) ?? []);
    });
  });
}

export async function closeDb(): Promise<void> {
  if (!db) {
    return;
  }

  const currentDb = db;
  db = null;

  await new Promise<void>((resolve, reject) => {
    currentDb.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
