import { readFile } from "node:fs/promises";
import { getDb } from "./db.js";

export async function initSchema(): Promise<void> {
  const schemaFileUrl = new URL("./schema.sql", import.meta.url);
  const schemaSql = await readFile(schemaFileUrl, "utf-8");

  await new Promise<void>((resolve, reject) => {
    getDb().exec(schemaSql, (err: any) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

  console.log("Schema is ready");
}
