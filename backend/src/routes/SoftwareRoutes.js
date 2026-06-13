import { Router } from "express";
import * as softwareController from "../controllers/softwareController.js";
export const softwareRoutes = Router();
softwareRoutes.get("/", softwareController.getAll);
softwareRoutes.get("/:id", softwareController.getById);
softwareRoutes.post("/", softwareController.create);
softwareRoutes.put("/:id", softwareController.update);
softwareRoutes.delete("/:id", softwareController.remove);
//# sourceMappingURL=SoftwareRoutes.js.map