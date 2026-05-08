import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { softwareRoutes } from "./routes/SoftwareRoutes.js";

export const app = express();
app.use(express.json());

app.get("/health",( _req, res) => {
    res.status(200).json({ ok:true });
});

app.use("/api/software", softwareRoutes);
app.use(errorHandler);
