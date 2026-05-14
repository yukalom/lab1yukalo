import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

function mapSqliteError(err: unknown): AppError | null {
  if (!(err instanceof Error)) {
    return null;
  }

  const message = err.message;

  if (
    message.includes("UNIQUE constraint failed") ||
    message.includes("SQLITE_CONSTRAINT: UNIQUE")
  ) {
    return new AppError(409, "CONFLICT", "Resource already exists");
  }

  if (
    message.includes("FOREIGN KEY constraint failed") ||
    message.includes("SQLITE_CONSTRAINT: FOREIGN KEY")
  ) {
    return new AppError(400, "VALIDATION_ERROR", "Invalid reference");
  }

  if (
    message.includes("NOT NULL constraint failed") ||
    message.includes("SQLITE_CONSTRAINT: NOT NULL")
  ) {
    return new AppError(400, "VALIDATION_ERROR", "Missing required field");
  }

  if (message.includes("database is locked")) {
    return new AppError(500, "DB_LOCKED", "Database temporarily unavailable");
  }

  return null;
}

function logAppError(error: AppError, method: string, path: string): void {
  const location = `${method} ${path}`;

  if (error.status >= 500) {
    console.error(`[error] ${location} ${error.code}: ${error.message}`);
    return;
  }

  if (error.status === 404) {
    return;
  }

  console.warn(`[warn] ${location} ${error.code}: ${error.message}`);
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const mappedError =
    err instanceof AppError ? err : (mapSqliteError(err) ?? null);

  if (mappedError) {
    logAppError(mappedError, req.method, req.originalUrl);

    res.status(mappedError.status).json({
      code: mappedError.code,
      message: mappedError.message,
    });
    return;
  }

  console.error(`[error] ${req.method} ${req.originalUrl}`, err);

  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  });
};
