import { AppError } from "../errors/AppError.js";
import { error } from "node:console";
import { version } from "node:os";
export async function parseId(rawId) {
    if (!rawId) {
        return null;
    }
    if (Array.isArray(rawId)) {
        return Number(rawId[0]);
    }
    return Number(rawId);
}
export function parseNumberOrDefault(rawValue, defaultValue) {
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : defaultValue;
}
export function parseListQuery(req) {
    const sortByRaw = req.query.sortBy;
    const sortDirRaw = req.query.sortDir;
    const sortBy = sortByRaw === "id" || sortByRaw === "software_id" || sortByRaw === "license_key"
        ? sortByRaw
        : "software_id";
    const sortDir = sortDirRaw === "asc" ? "asc" : "desc";
    return {
        limit: parseNumberOrDefault(req.query.limit, 20),
        offset: parseNumberOrDefault(req.query.offset, 0),
        q: typeof req.query.q === "string" ? req.query.q : null,
        sortBy,
        sortDir,
    };
}
export async function create(req) {
    if (!req.body.software_id || !req.body.license_key) {
        return null;
    }
    return {
        software_id: req.body.software_id,
        license_key: req.body.license_key
    };
}
export async function update(id, req) {
    if (!id) {
        return null;
    }
    if (id < 0 || !req.body.software_id || !req.body.license_key) {
        return null;
    }
    return {
        id: id,
        software_id: req.body.software_id,
        license_key: req.body.license_key
    };
}
//# sourceMappingURL=licenseService.js.map