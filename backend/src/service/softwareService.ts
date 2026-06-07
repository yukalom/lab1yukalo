import type { Request } from "express";
import { AppError } from "../errors/AppError.js";
import type { ListItemsQuery, softwareUpdateDto, softwareCreateDto } from "../types/Software.js";

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
  const allowedSort = ['name','version','licensetype','date'];
  if (sortByRaw !== undefined && (typeof sortByRaw !== "string" || !allowedSort.includes(sortByRaw))) {
    throw new AppError(400, "BAD_REQUEST", "Invalid sortBy");
  }
  if (sortDirRaw !== undefined && sortDirRaw !== "asc" && sortDirRaw !== "desc") {
    throw new AppError(400, "BAD_REQUEST", "Invalid sortDir");
  }
  return {
    limit: parseNumberOrDefault(req.query.limit, 20),
    offset: parseNumberOrDefault(req.query.offset, 0),
    q: typeof req.query.q === "string" ? req.query.q : null,
    sortBy: (sortByRaw ?? "date") as NonNullable<ListItemsQuery["sortBy"]>,
    sortDir: sortDirRaw === "asc" ? "asc" : "desc",
  };
}

export async function create(req: Request): Promise<softwareCreateDto | null> {
  const name = String(req.body.name ?? "").trim();
  const version = Number(req.body.version);
  const licensetype = req.body.licensetype;
  const date = String(req.body.date ?? "").trim();
  if (!name || !Number.isFinite(version) || version <= 0 || !["Free", "Commercial", "Academic"].includes(licensetype) || !date) return null;
  return { name, version, licensetype, date };
}

export async function update(id: number | null, req: Request): Promise<softwareUpdateDto | null> {
  const item = await create(req);
  if (!id || !item) return null;
  return { id, ...item };
}
