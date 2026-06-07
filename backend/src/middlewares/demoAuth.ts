import type { Request, RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import * as userRepository from "../repositories/userRepository.js";

export type AuthedRequest = Request & { user: { id: number } };

export const demoAuth: RequestHandler = async (req, _res, next) => {
  try {
    const rawUserId = req.header("X-Demo-UserId");
    const userId = Number(rawUserId);
    if (!rawUserId || !Number.isInteger(userId) || userId <= 0) {
      next(new AppError(401, "UNAUTHORIZED", "X-Demo-UserId is required"));
      return;
    }
    const user = await userRepository.getById(userId);
    if (!user) {
      next(new AppError(401, "UNAUTHORIZED", "Unknown user"));
      return;
    }
    (req as AuthedRequest).user = { id: userId };
    next();
  } catch (err) {
    next(err);
  }
};
