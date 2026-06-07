import { Router, type RequestHandler } from "express";
import * as requestController from "../controllers/requestController.js";
import { demoAuth } from "../middlewares/demoAuth.js";

export const requestRoutes = Router();
requestRoutes.use(demoAuth);
requestRoutes.get("/", requestController.getAll as RequestHandler);
requestRoutes.get("/:id", requestController.getById as RequestHandler);
requestRoutes.post("/", requestController.create as RequestHandler);
requestRoutes.put("/:id", requestController.update as RequestHandler);
requestRoutes.delete("/:id", requestController.remove as RequestHandler);
