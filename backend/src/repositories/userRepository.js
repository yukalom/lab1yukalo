import { all, get, run } from "../db/db.js";
const sortColumnMap = {
    id: "id",
    name: "name",
    login: "login",
    password: "password"
};
function mapRowToDto(row) {
    return {
        id: Number(row.id),
        name: String(row.name),
        login: String(row.login),
        password: String(row.password)
    };
}
export async function getById(id) {
    const row = await get("SELECT * FROM user WHERE id = ?", [id]);
    return row ? mapRowToDto(row) : null;
}
export async function update(dto) {
    const result = await run(`UPDATE user SET name = ?, login = ?, password = ? WHERE id = ?`, [dto.name, dto.login, dto.password, dto.id]);
    if (result.changes === 0)
        return null;
    return getById(dto.id);
}
export async function create(dto) {
    const result = await run(`INSERT INTO user (name, login, password) VALUES (?, ?, ?)`, [dto.name, dto.login, dto.password]);
    const created = await getById(result.lastID);
    if (!created)
        throw new Error("Created item could not be reloaded");
    return created;
}
export async function remove(id) {
    const result = await run("DELETE FROM user WHERE id = ?", [id]);
    return result.changes > 0;
}
export async function getAll(query) {
    const conditions = [];
    const params = [];
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
    const offset = Math.max(Number(query.offset ?? 0), 0);
    if (query.q && query.q.trim() !== "") {
        conditions.push("(name LIKE ? OR login LIKE ?)");
        params.push(`%${query.q.trim()}%`, `%${query.q.trim()}%`);
    }
    const whereSql = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const sortBy = query.sortBy ?? "name";
    const sortColumn = sortColumnMap[sortBy] ?? "name";
    const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";
    const countRow = await get(`SELECT COUNT(*) AS count FROM user${whereSql}`, params);
    const rows = await all(`SELECT * FROM user${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`, [...params, limit, offset]);
    return {
        items: rows.map(mapRowToDto),
        page: {
            limit,
            offset,
            count: Number(countRow?.count ?? 0),
        },
    };
}
//# sourceMappingURL=userRepository.js.map