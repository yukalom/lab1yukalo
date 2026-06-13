import { all, get, run } from "../db/db.js";
const sortColumnMap = {
    id: "id",
    date: "date",
    name: "name",
    version: "version",
    licensetype: "licensetype"
};
function mapRowToDto(row) {
    return {
        id: Number(row.id),
        name: String(row.name),
        version: Number(row.version),
        licensetype: row.licensetype,
        date: String(row.date)
    };
}
export async function getById(id) {
    const row = await get("SELECT * FROM softwareProducts WHERE id = ?", [id]);
    return row ? mapRowToDto(row) : null;
}
export async function update(dto) {
    const result = await run(`UPDATE softwareProducts
     SET name = ?, version = ?, licensetype = ?, date = ?
     WHERE id = ?`, [dto.name, dto.version, dto.licensetype, dto.date, dto.id]);
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
        conditions.push("name LIKE ?");
        params.push(`%${query.q.trim()}%`);
    }
    const whereSql = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const sortBy = query.sortBy ?? "date";
    const sortColumn = sortColumnMap[sortBy] ?? "date";
    const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";
    const countRow = await get(`SELECT COUNT(*) AS count FROM softwareProducts${whereSql}`, params);
    const rows = await all(`SELECT * FROM softwareProducts${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`, [...params, limit, offset]);
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
    const result = await run(`INSERT INTO softwareProducts (name, version, licensetype, date)
     VALUES (?, ?, ?, ?)`, [dto.name, dto.version, dto.licensetype, dto.date]);
    const createdItem = await getById(result.lastID);
    if (!createdItem)
        throw new Error("Created item could not be reloaded from database");
    return createdItem;
}
export async function remove(id) {
    const result = await run("DELETE FROM softwareProducts WHERE id = ?", [id]);
    return result.changes > 0;
}
//# sourceMappingURL=SoftwareRepository.js.map