import type { NextFunction, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { AuthedRequest } from "../middlewares/demoAuth.js";
import * as requestRepository from "../repositories/requestRepository.js";
import * as requestService from "../service/requestService.js";

export async function getAll(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await requestRepository.getAll(requestService.parseListQuery(req), req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

export async function getById(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = await requestService.parseId(req.params.id);
    if (!id) { next(new AppError(400, "BAD_REQUEST", "Invalid id")); return; }
    const result = await requestRepository.getById(id, req.user.id);
    if (!result) { next(new AppError(404, "NOT_FOUND", "Request not found")); return; }
    res.status(200).json(result);
  } catch (err) { next(err); }
}

export async function create(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await requestService.create(req);
    if (!item) { next(new AppError(400, "BAD_REQUEST", "Create validation error")); return; }
    const created = await requestRepository.create(item, req.user.id);
    res.status(201).json(created);
  } catch (err) { next(err); }
}

export async function update(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await requestService.update(await requestService.parseId(req.params.id), req);
    if (!item) { next(new AppError(400, "BAD_REQUEST", "Update validation error")); return; }
    const updated = await requestRepository.update(item, req.user.id);
    if (!updated) { next(new AppError(404, "NOT_FOUND", "Request not found")); return; }
    res.json(updated);
  } catch (err) { next(err); }
}

export async function remove(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = await requestService.parseId(req.params.id);
    if (!id) { next(new AppError(400, "BAD_REQUEST", "Invalid id")); return; }
    const removed = await requestRepository.remove(id, req.user.id);
    if (!removed) { next(new AppError(404, "NOT_FOUND", "Request not found")); return; }
    res.status(204).send();
  } catch (err) { next(err); }
}
