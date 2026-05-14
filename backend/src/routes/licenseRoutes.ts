import { Router } from "express";
import * as licenseController from "../controllers/licenseController.js";


export const licenseRoutes = Router();
licenseRoutes.get("/", licenseController.getAll);
licenseRoutes.get("/:id",licenseController.getById);
licenseRoutes.post("/",licenseController.create);
licenseRoutes.put("/:id",licenseController.update);
licenseRoutes.delete("/:id",licenseController.remove);
