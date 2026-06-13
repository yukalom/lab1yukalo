import { mkdir } from "node:fs/promises";
import path from "node:path";
import sqlite3 from "sqlite3";
import { config } from "../config.js";
let db = null;
function ensureDb() {
    if (!db) {
        throw new Error("Database connection has not been initialized");
    }
    return db;
}
export function getDb() {
    return ensureDb();
}
export async function initDb() {
    if (db) {
        return;
    }
    const absoluteDbPath = path.resolve(config.dbPath);
    const dbDirectory = path.dirname(absoluteDbPath);
    await mkdir(dbDirectory, { recursive: true });
    db = await new Promise((resolve, reject) => {
        const instance = new sqlite3.Database(absoluteDbPath, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(instance);
        });
    });
    db.configure("busyTimeout", 3000);
    await new Promise((resolve, reject) => {
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
export function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        ensureDb().run(sql, params, function (err) {
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
export function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        ensureDb().get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row ?? null);
        });
    });
}
export function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        ensureDb().all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows ?? []);
        });
    });
}
export async function closeDb() {
    if (!db) {
        return;
    }
    const currentDb = db;
    db = null;
    await new Promise((resolve, reject) => {
        currentDb.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
//# sourceMappingURL=db.js.map