import { all, get, run } from "../db/db.js";
import type {
  userDto,
  userRow,
  userUpdateDto,
  ListItemsQuery,
  userCreateDto,
  listUser
} from "../types/user.js";

type CountRow = { count: number };
type UserSortBy = NonNullable<ListItemsQuery["sortBy"]>;

const sortColumnMap: Record<UserSortBy, string> = {
  id: "id",
  name: "name",
  login: "login",
  password: "password"
};

function mapRowToDto(row: userRow): userDto {
  return {
    id: Number(row.id),
    name: String(row.name),
    login: String(row.login),
    password: String(row.password)
  };
}

export async function getById(id: number): Promise<userDto | null> {
  const row = await get<userRow>("SELECT * FROM user WHERE id = ?", [id]);
  return row ? mapRowToDto(row) : null;
}

export async function update(dto: userUpdateDto): Promise<userDto | null> {
  const result = await run(
    `UPDATE user SET name = ?, login = ?, password = ? WHERE id = ?`,
    [dto.name, dto.login, dto.password, dto.id]
  );
  if (result.changes === 0) return null;
  return getById(dto.id);
}

export async function create(dto: userCreateDto): Promise<userDto> {
  const result = await run(
    `INSERT INTO user (name, login, password) VALUES (?, ?, ?)`,
    [dto.name, dto.login, dto.password]
  );
  const created = await getById(result.lastID);
  if (!created) throw new Error("Created item could not be reloaded");
  return created;
}

export async function remove(id: number): Promise<boolean> {
  const result = await run("DELETE FROM user WHERE id = ?", [id]);
  return result.changes > 0;
}

export async function getAll(query: ListItemsQuery): Promise<listUser> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);

  if (query.q && query.q.trim() !== "") {
    conditions.push("(name LIKE ? OR login LIKE ?)");
    params.push(`%${query.q.trim()}%`, `%${query.q.trim()}%`);
  }

  const whereSql = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
  const sortBy: UserSortBy = query.sortBy ?? "name";
  const sortColumn = sortColumnMap[sortBy] ?? "name";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";

  const countRow = await get<CountRow>(`SELECT COUNT(*) AS count FROM user${whereSql}`, params);
  const rows = await all<userRow>(
    `SELECT * FROM user${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    items: rows.map(mapRowToDto),
    page: {
      limit,
      offset,
      count: Number(countRow?.count ?? 0),
    },
  };
}
