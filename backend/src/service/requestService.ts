import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { error } from "node:console";
import { version } from "node:os";
import type { ListItemsQuery, requestUpdateDto, requestCreateDto } from "../types/request.js"

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
    sortByRaw === "id" || sortByRaw === "software_id" || sortByRaw === "user_id" || sortByRaw === "request_date"
      ? sortByRaw
      : "user_id";

  const sortDir = sortDirRaw === "asc" ? "asc" : "desc";

  return {
    limit: parseNumberOrDefault(req.query.limit, 20),
    offset: parseNumberOrDefault(req.query.offset, 0), 
    q: typeof req.query.q === "string" ? req.query.q : null,
    sortBy,
    sortDir,
  };
}

export async function create(
    req: Request
): Promise <requestCreateDto | null> {
    if (!req.body.software_id || !req.body.user_id || !req.body.request_date )
        {return null;} 
    return {  
        software_id: req.body.software_id,
        user_id: req.body.user_id,
        request_date: req.body.request_date
    };
}

export async function update (id: number | null, req: Request): Promise<requestUpdateDto | null> {
    if(!id){
        return null;
    }

    if (id<0 || !req.body.software_id || !req.body.user_id || !req.body.request_date ) {
        return null;
    }

    return {
        id: id,
        software_id: req.body.software_id,
        user_id: req.body.user_id,
        request_date: req.body.request_date,
    };
}
