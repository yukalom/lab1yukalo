import { all, get, run } from "../db/db.js";
const sortColumnMap = {
    id: "id",
    software_id: "software_id",
    user_id: "user_id",
    request_date: "request_date"
};
function mapRowToDto(row) {
    return {
        id: Number(row.id),
        software_id: Number(row.software_id),
        user_id: Number(row.user_id),
        request_date: String(row.request_date),
    };
}
export async function getById(id) {
    const row = await get("SELECT * FROM request WHERE id = ?", [id]);
    return row ? mapRowToDto(row) : null;
}
export async function update(dto) {
    const result = await run(`UPDATE request SET request_date = ?, software_id = ?, user_id = ? WHERE id = ?`, [dto.request_date, dto.software_id, dto.user_id, dto.id]);
    if (result.changes === 0)
        return null;
    return getById(dto.id);
}
export async function getAll(query) {
    const conditions = [];
    const params = [];
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
    const offset = Math.max(Number(query.offset ?? 0), 0);
    if (query.q && query.q.trim() !== "") {
        conditions.push("request_date LIKE ?");
        params.push(`%${query.q.trim()}%`);
    }
    const whereSql = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const sortBy = query.sortBy ?? "user_id";
    const sortColumn = sortColumnMap[sortBy] ?? "user_id";
    const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";
    const countRow = await get(`SELECT COUNT(*) AS count FROM request${whereSql}`, params);
    const rows = await all(`SELECT * FROM request${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`, [...params, limit, offset]);
    return {
        items: rows.map(mapRowToDto),
        page: {
            limit,
            offset,
            count: Number(countRow?.count ?? 0),
        },
    };
}
export async function create(dto) {
    const result = await run(`INSERT INTO request (software_id, user_id, request_date) VALUES (?, ?, ?)`, [dto.software_id, dto.user_id, dto.request_date]);
    const created = await getById(result.lastID);
    if (!created)
        throw new Error("Created item could not be reloaded");
    return created;
}
export async function remove(id) {
    const result = await run("DELETE FROM request WHERE id = ?", [id]);
    return result.changes > 0;
}
//# sourceMappingURL=requestRepository.js.map