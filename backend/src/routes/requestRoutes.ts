import { Router } from "express";
import * as requestController from "../controllers/requestController.js";


export const requestRoutes = Router();
requestRoutes.get("/", requestController.getAll);
requestRoutes.get("/:id",requestController.getById);
requestRoutes.post("/",requestController.create);
requestRoutes.put("/:id",requestController.update);
requestRoutes.delete("/:id",requestController.remove);
