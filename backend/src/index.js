import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { softwareRoutes } from "./routes/SoftwareRoutes.js";
import { licenseRoutes } from "./routes/licenseRoutes.js";
import { requestRoutes } from "./routes/requestRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
export const app = express();
function isAllowedDevOrigin(origin) {
    if (!origin)
        return false;
    try {
        const url = new URL(origin);
        const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
        const isHttp = url.protocol === "http:";
        return isHttp && isLocalhost;
    }
    catch {
        return false;
    }
}
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (isAllowedDevOrigin(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "false");
    }
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,Accept");
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
    next();
});
app.use(express.json());
app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
});
app.use("/api/software", softwareRoutes);
app.use("/api/user", userRoutes);
app.use("/api/license", licenseRoutes);
app.use("/api/request", requestRoutes);
app.use(errorHandler);
//# sourceMappingURL=index.js.map