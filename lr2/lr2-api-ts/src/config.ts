import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  dbPath: process.env.DB_PATH ?? "./data/app.db",
  seedOnStart: (process.env.SEED_ON_START ?? "false").toLowerCase() === "true",
};
