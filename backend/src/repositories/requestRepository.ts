import { all, get, run } from "../db/db.js";
import type { requestDto, requestRow, requestUpdateDto, ListItemsQuery, requestCreateDto, listRequest } from "../types/request.js";

const sortColumnMap = { software_id: "software_id", user_id: "user_id", request_date: "request_date" } as const;
type CountRow = { count: number };

function mapRowToDto(row: requestRow): requestDto {
  return { id: Number(row.id), software_id: Number(row.software_id), user_id: Number(row.user_id), request_date: String(row.request_date) };
}

export async function getById(id: number, currentUserId?: number): Promise<requestDto | null> {
  const params: unknown[] = [id];
  let sql = "SELECT * FROM request WHERE id = ?";
  if (currentUserId !== undefined) {
    sql += " AND user_id = ?";
    params.push(currentUserId);
  }
  const row = await get<requestRow>(sql, params);
  return row ? mapRowToDto(row) : null;
}

export async function update(dto: requestUpdateDto, currentUserId: number): Promise<requestDto | null> {
  const result = await run(
    "UPDATE request SET request_date = ?, software_id = ?, user_id = ? WHERE id = ? AND user_id = ?",
    [dto.request_date, dto.software_id, currentUserId, dto.id, currentUserId],
  );
  return result.changes === 0 ? null : getById(dto.id, currentUserId);
}

export async function getAll(query: ListItemsQuery, currentUserId: number): Promise<listRequest> {
  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);
  const sortBy = query.sortBy ?? "request_date";
  const sortColumn = sortColumnMap[sortBy as keyof typeof sortColumnMap] ?? "request_date";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";
  const params: unknown[] = [currentUserId];
  let whereSql = " WHERE user_id = ?";
  if (query.q && query.q.trim() !== "") {
    whereSql += " AND request_date LIKE ?";
    params.push(`%${query.q.trim()}%`);
  }
  const rows = await all<requestRow>(`SELECT * FROM request${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  const countRow = await get<CountRow>(`SELECT COUNT(*) AS count FROM request${whereSql}`, params);
  return { items: rows.map(mapRowToDto), page: { limit, offset, count: Number(countRow?.count ?? 0) } };
}

export async function create(dto: requestCreateDto, currentUserId: number): Promise<requestDto> {
  const result = await run(
    "INSERT INTO request (software_id, user_id, request_date) VALUES (?, ?, ?)",
    [dto.software_id, currentUserId, dto.request_date],
  );
  const created = await getById(result.lastID, currentUserId);
  if (!created) throw new Error("Created request could not be reloaded");
  return created;
}

export async function remove(id: number, currentUserId: number): Promise<boolean> {
  const result = await run("DELETE FROM request WHERE id = ? AND user_id = ?", [id, currentUserId]);
  return result.changes > 0;
}
