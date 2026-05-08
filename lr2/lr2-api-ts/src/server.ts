import type { Server } from "node:http";
import { app } from "./index.js";
import { config } from "./config.js";
import { closeDb, initDb } from "./db/db.js";
import { initSchema } from "./db/initSchema.js";
// import { seedIfNeeded } from "./db/seed.js";

let server: Server | null = null;
let isShuttingDown = false;

async function bootstrap(): Promise<void> {
  console.log("Starting application...");
  console.log("Connecting DB...");

  await initDb();

  console.log("Applying schema...");
  await initSchema();

  // if (config.seedOnStart) {
  //   console.log("Running seed...");
  //   await seedIfNeeded();
  // }

  server = app.listen(config.port, () => {
    console.log(`HTTP server is listening on port ${config.port}`);
  });
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}, shutting down...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      });
    }

    await closeDb();
    console.log("Shutdown completed");
    process.exit(0);
  } catch (err) {
    console.error("Shutdown failed", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

bootstrap().catch((err) => {
  console.error("Failed to start application", err);
  process.exit(1);
});
