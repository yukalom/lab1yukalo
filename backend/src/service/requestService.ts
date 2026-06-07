import type { Request } from "express";
import { AppError } from "../errors/AppError.js";
import type { ListItemsQuery, requestUpdateDto, requestCreateDto } from "../types/request.js";

export async function parseId(rawId: string | string[] | undefined): Promise<number | null> {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseNumberOrDefault(rawValue: unknown, defaultValue: number): number {
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

export function parseListQuery(req: Request): ListItemsQuery {
  const sortByRaw = req.query.sortBy;
  const sortDirRaw = req.query.sortDir;
  const allowedSort = ["software_id", "user_id", "request_date"];
  if (sortByRaw !== undefined && (typeof sortByRaw !== "string" || !allowedSort.includes(sortByRaw))) {
    throw new AppError(400, "BAD_REQUEST", "Invalid sortBy");
  }
  if (sortDirRaw !== undefined && sortDirRaw !== "asc" && sortDirRaw !== "desc") {
    throw new AppError(400, "BAD_REQUEST", "Invalid sortDir");
  }
  return { limit: parseNumberOrDefault(req.query.limit, 20), offset: parseNumberOrDefault(req.query.offset, 0), q: typeof req.query.q === "string" ? req.query.q : null, sortBy: (sortByRaw ?? "request_date") as NonNullable<ListItemsQuery["sortBy"]>, sortDir: sortDirRaw === "asc" ? "asc" : "desc" };
}

export async function create(req: Request): Promise<requestCreateDto | null> {
  const software_id = Number(req.body.software_id);
  const request_date = String(req.body.request_date ?? "").trim();
  if (!Number.isInteger(software_id) || software_id <= 0 || !request_date) return null;
  return { software_id, user_id: 0, request_date };
}

export async function update(id: number | null, req: Request): Promise<requestUpdateDto | null> {
  const software_id = Number(req.body.software_id);
  const request_date = String(req.body.request_date ?? "").trim();
  if (!id || !Number.isInteger(software_id) || software_id <= 0 || !request_date) return null;
  return { id, software_id, user_id: 0, request_date };
}
