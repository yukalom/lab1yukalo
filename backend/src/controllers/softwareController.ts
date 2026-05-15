import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import * as softwareRepository from "../repositories/SoftwareRepository.js";
// import * as softwareRepository from "../repositories/SoftwareRepositoryBE.js";
import type { ListItemsQuery } from "../types/Software.js";
import { error } from "node:console";
import * as softwareService from "../service/softwareService.js";



export async function getAll(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const result = await softwareRepository.getAll(softwareService.parseListQuery(req));
        res.json (result);
    }
    catch (err) {
        next(err);
    }
}

// export async function getById(
//     res: Response,
//     req: Request,
//     next: NextFunction,
// ): Promise <void> {
//     try {
//         const id = req.params.id;
//         const result = await softwareRepository.getById(id);
//         res.json(result);
//     }
//     catch (err) {
//         next(err);
//     }
// }

export async function getById(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise <void> {
    try {
        const id = await softwareService.parseId(req.params.id);
        if (!id){
            next(new AppError (400, "BAD_REQUEST", "Create validation error"));
            return;
        }
        const result = await softwareRepository.getById(id);
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
        const item = await softwareService.create(req);
        if(!item){
            next(new AppError(400, "BAD_REQUEST", "Create validation error"));
            return;
        }
        const create = await softwareRepository.create(item);
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
        const item = await softwareService.update(await softwareService.parseId(req.params.id), req);

        if ( !item ){
            next (new AppError (400, "BAD_REQUEST", "ERROR VALIDATION"));
            return;
        }

        const update = await softwareRepository.update(item);
    
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
    const id = await softwareService.parseId(req.params.id);
    if (!id){
        next(new AppError (400, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
        return;
    }

    const removed = await softwareRepository.remove(id);

    if (!removed) {
      next(new AppError(404, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}