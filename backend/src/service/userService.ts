import type { Request } from "express";
import { AppError } from "../errors/AppError.js";
import type { ListItemsQuery, userUpdateDto, userCreateDto } from "../types/user.js";

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
  const allowedSort = ['name','login','id'];
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
    sortBy: (sortByRaw ?? "name") as NonNullable<ListItemsQuery["sortBy"]>,
    sortDir: sortDirRaw === "asc" ? "asc" : "desc",
  };
}

export async function create(req: Request): Promise<userCreateDto | null> {
  const name = String(req.body.name ?? "").trim();
  const login = String(req.body.login ?? name).trim();
  const password = String(req.body.password ?? "demo").trim();
  if (!name || !login || !password) return null;
  return { name, login, password };
}

export async function update(id: number | null, req: Request): Promise<userUpdateDto | null> {
  const name = String(req.body.name ?? "").trim();
  const login = String(req.body.login ?? name).trim();
  const password = String(req.body.password ?? "demo").trim();
  if (!id || !name || !login || !password) return null;
  return { id, name, login, password };
}
