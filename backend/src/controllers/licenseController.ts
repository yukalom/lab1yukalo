import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import * as licenseRepository from "../repositories/licenseRepository.js";
// import * as licenseRepository from "../repositories/licenseRepositoryBE.js";
import * as licenseService from "../service/licenseService.js";

export async function getAll(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const result = await licenseRepository.getAll(licenseService.parseListQuery(req));
        res.json (result);
    }
    catch (err) {
        next(err);
    }
}

export async function getById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise <void> {
    try {
        const id = await licenseService.parseId(req.params.id);
        if (!id){
            next(new AppError (400, "BAD_REQUEST", "Create validation error"));
            return;
        }
        const result = await licenseRepository.getById(id);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}

export async function create(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise <void> {
    try {
        const item = await licenseService.create(req);
        if(!item){
            next(new AppError(400, "BAD_REQUEST", "Create validation error"));
            return;
        }
        const create = await licenseRepository.create(item);
        res.status(201).json(create);
    }
    catch (err){
        next(err);
    }
}

export async function update(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise <void>{
    try{
        const item = await licenseService.update(await licenseService.parseId(req.params.id), req);

        if ( !item ){
            next (new AppError (400, "BAD_REQUEST", "ERROR VALIDATION"));
            return;
        }

        const update = await licenseRepository.update(item);
    
        if (!update) {
            next (new AppError (404, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
            return;
        }

        res.json(update);
    } catch (err) {
        next (err);
    }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = await licenseService.parseId(req.params.id);
    if (!id){
        next(new AppError (400, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
        return;
    }

    const removed = await licenseRepository.remove(id);

    if (!removed) {
      next(new AppError(404, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}