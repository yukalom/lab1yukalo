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
    const sortBy = sortByRaw === "id" || sortByRaw === "name" || sortByRaw === "version" || sortByRaw === "licensetype" || sortByRaw === "date"
        ? sortByRaw
        : "date";
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
    if (req.body.version <= 0 || !req.body.name || !req.body.licensetype || !req.body.date) {
        return null;
    }
    return {
        name: req.body.name,
        version: req.body.version,
        licensetype: req.body.licensetype,
        date: req.body.date
    };
}
export async function update(id, req) {
    if (!id) {
        return null;
    }
    if (req.body.version <= 0 || id < 0 || !req.body.name || !req.body.licensetype || !req.body.date) {
        return null;
    }
    return {
        id: id,
        name: req.body.name,
        version: req.body.version,
        licensetype: req.body.licensetype,
        date: req.body.date
    };
}
//# sourceMappingURL=softwareService.js.map