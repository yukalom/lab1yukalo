import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import * as requestRepository from "../repositories/requestRepository.js";
// import * as requestRepository from "../repositories/requestRepositoryBE.js";
import * as softwareService from "../service/requestService.js";
import * as requestService from "../service/requestService.js"


export async function getAll(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const result = await requestRepository.getAll(softwareService.parseListQuery(req));
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
        const id = await requestService.parseId(req.params.id);
        if (!id){
            next(new AppError (400, "BAD_REQUEST", "Create validation error"));
            return;
        }
        const result = await requestRepository.getById(id);
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
        const item = await requestService.create(req);
        if(!item){
            next(new AppError(400, "BAD_REQUEST", "Create validation error"));
            return;
        }
        const create = await requestRepository.create(item);
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
        const item = await requestService.update(await requestService.parseId(req.params.id), req);

        if ( !item ){
            next (new AppError (400, "BAD_REQUEST", "ERROR VALIDATION"));
            return;
        }

        const update = await requestRepository.update(item);
    
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
    const id = await requestService.parseId(req.params.id);
    if (!id){
        next(new AppError (400, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
        return;
    }

    const removed = await requestRepository.remove(id);

    if (!removed) {
      next(new AppError(404, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}