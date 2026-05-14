import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { softwareRoutes } from "./routes/SoftwareRoutes.js";
import {licenseRoutes} from "./routes/licenseRoutes.js"
import {requestRoutes} from "./routes/requestRoutes.js"
import { userRoutes } from "./routes/userRoutes.js";

export const app = express();
app.use(express.json());

app.get("/health",( _req, res) => {
    res.status(200).json({ ok:true });
});

app.use("/api/software", softwareRoutes);
app.use("/api/user", userRoutes);
app.use("/api/license", licenseRoutes);
app.use("/api/request", requestRoutes);
app.use(errorHandler);

