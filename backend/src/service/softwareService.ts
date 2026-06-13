import type {
  softwareDto,
  softwareRow,
  softwareUpdateDto,
  ListItemsQuery,
  softwareCreateDto,
  listSoftware
} from "../types/Software.js";

import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { error } from "node:console";
import { version } from "node:os";


export async function parseId(rawId: string | string[] | undefined): Promise<number | null> {
    if(!rawId){return null;}
  if (Array.isArray(rawId)) {
    return Number(rawId[0]);
  }
  return Number(rawId);
}

export function parseNumberOrDefault(rawValue: unknown, defaultValue: number): number {
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

export function parseListQuery(req: Request): ListItemsQuery {
  const sortByRaw = req.query.sortBy;
  const sortDirRaw = req.query.sortDir;

  const sortBy =
    sortByRaw === "id" || sortByRaw === "name" || sortByRaw === "version" || sortByRaw === "licensetype" || sortByRaw === "date"
      ? sortByRaw
      : "date";

  const sortDir = sortDirRaw === "asc" ? "asc" : "desc";

  return {
    limit: parseNumberOrDefault(req.query.limit, 20),
    offset: parseNumberOrDefault(req.query.offset, 0),
    q: typeof req.query.q === "string" ? req.query.q : null,
    sortBy,
    sortDir,
  };
}

export async function create (req: Request): Promise<softwareCreateDto | null> {

    if (req.body.version <= 0 || !req.body.name || !req.body.licensetype || !req.body.date) {
        return null;
    }

    return {
        name: req.body.name,
        version: req.body.version,
        licensetype: req.body.licensetype,
        date: req.body.date
    };
}

export async function update (id: number | null, req: Request): Promise<softwareUpdateDto | null> {
    if(!id){
        return null;
    }

    if (req.body.version <= 0 ||  id < 0 || !req.body.name || !req.body.licensetype || !req.body.date) {
        return null;
    }

    return {
        id: id,
        name: req.body.name,
        version: req.body.version,
        licensetype: req.body.licensetype,
        date: req.body.date
    };
}