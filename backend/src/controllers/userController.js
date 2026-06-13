import { AppError } from "../errors/AppError.js";
import * as userRepository from "../repositories/userRepository.js";
import { error } from "node:console";
import * as userService from "../service/userService.js";
export async function getAll(req, res, next) {
    try {
        const result = await userRepository.getAll(userService.parseListQuery(req));
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
export async function getById(req, res, next) {
    try {
        const id = await userService.parseId(req.params.id);
        if (!id) {
            next(new AppError(400, "BAD_REQUEST", "Create validation error"));
            return;
        }
        const result = await userRepository.getById(id);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
export async function create(req, res, next) {
    try {
        const item = await userService.create(req);
        if (!item) {
            next(new AppError(400, "BAD_REQUEST", "Create validation error"));
            return;
        }
        const create = await userRepository.create(item);
        res.status(201).json(create);
    }
    catch (err) {
        next(err);
    }
}
export async function update(req, res, next) {
    try {
        const item = await userService.update(await userService.parseId(req.params.id), req);
        if (!item) {
            next(new AppError(400, "BAD_REQUEST", "ERROR VALIDATION"));
            return;
        }
        const update = await userRepository.update(item);
        if (!update) {
            next(new AppError(404, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
            return;
        }
        res.json(update);
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    try {
        const id = await userService.parseId(req.params.id);
        if (!id) {
            next(new AppError(400, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
            return;
        }
        const removed = await userRepository.remove(id);
        if (!removed) {
            next(new AppError(404, "NOT_FOUND", "ERROR RESOURCE NOT FOUND"));
            return;
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=userController.js.map