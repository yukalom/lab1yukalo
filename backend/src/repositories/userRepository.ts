import { all, get, run } from "../db/db.js";
import type { userDto, userRow, userUpdateDto, ListItemsQuery, userCreateDto, listUser } from "../types/user.js";

const sortColumnMap = { id: "id", name: "name", login: "login" } as const;

type CountRow = { count: number };

function mapRowToDto(row: userRow): userDto {
  return { id: Number(row.id), name: String(row.name), login: String(row.login), password: String(row.password) };
}

export async function getById(id: number): Promise<userDto | null> {
  const row = await get<userRow>("SELECT * FROM user WHERE id = ?", [id]);
  return row ? mapRowToDto(row) : null;
}

export async function update(dto: userUpdateDto): Promise<userDto | null> {
  const result = await run(
    "UPDATE user SET name = ?, login = ?, password = ? WHERE id = ?",
    [dto.name, dto.login, dto.password, dto.id],
  );
  return result.changes === 0 ? null : getById(dto.id);
}

export async function create(dto: userCreateDto): Promise<userDto> {
  const result = await run(
    "INSERT INTO user (name, login, password) VALUES (?, ?, ?)",
    [dto.name, dto.login, dto.password],
  );
  const created = await getById(result.lastID);
  if (!created) throw new Error("Created user could not be reloaded");
  return created;
}

export async function remove(id: number): Promise<boolean> {
  const result = await run("DELETE FROM user WHERE id = ?", [id]);
  return result.changes > 0;
}

export async function getAll(query: ListItemsQuery): Promise<listUser> {
  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);
  const sortBy = query.sortBy ?? "name";
  const sortColumn = sortColumnMap[sortBy as keyof typeof sortColumnMap] ?? "name";
  const sortDirection = query.sortDir === "desc" ? "DESC" : "ASC";
  const params: unknown[] = [];
  let whereSql = "";
  if (query.q && query.q.trim() !== "") {
    whereSql = " WHERE name LIKE ? OR login LIKE ?";
    params.push(`%${query.q.trim()}%`, `%${query.q.trim()}%`);
  }
  const rows = await all<userRow>(`SELECT * FROM user${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  const countRow = await get<CountRow>(`SELECT COUNT(*) AS count FROM user${whereSql}`, params);
  return { items: rows.map(mapRowToDto), page: { limit, offset, count: Number(countRow?.count ?? 0) } };
}
