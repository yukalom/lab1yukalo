import { all, get, run } from "../db/db.js";
import type { softwareDto, softwareRow, softwareUpdateDto, ListItemsQuery, softwareCreateDto, listSoftware } from "../types/Software.js";

const sortColumnMap = { name: "name", version: "version", licensetype: "licensetype", date: "date" } as const;
type CountRow = { count: number };

function mapRowToDto(row: softwareRow): softwareDto {
  return { id: Number(row.id), name: String(row.name), version: Number(row.version), licensetype: row.licensetype, date: String(row.date) };
}

export async function getById(id: number): Promise<softwareDto | null> {
  const row = await get<softwareRow>("SELECT * FROM softwareProducts WHERE id = ?", [id]);
  return row ? mapRowToDto(row) : null;
}

export async function update(dto: softwareUpdateDto): Promise<softwareDto | null> {
  const result = await run(
    "UPDATE softwareProducts SET name = ?, version = ?, licensetype = ?, date = ? WHERE id = ?",
    [dto.name, dto.version, dto.licensetype, dto.date, dto.id],
  );
  return result.changes === 0 ? null : getById(dto.id);
}

export async function getAll(query: ListItemsQuery): Promise<listSoftware> {
  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);
  const sortBy = query.sortBy ?? "date";
  const sortColumn = sortColumnMap[sortBy as keyof typeof sortColumnMap] ?? "date";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";
  const params: unknown[] = [];
  let whereSql = "";
  if (query.q && query.q.trim() !== "") {
    whereSql = " WHERE name LIKE ? OR licensetype LIKE ? OR date LIKE ?";
    params.push(`%${query.q.trim()}%`, `%${query.q.trim()}%`, `%${query.q.trim()}%`);
  }
  const rows = await all<softwareRow>(`SELECT * FROM softwareProducts${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  const countRow = await get<CountRow>(`SELECT COUNT(*) AS count FROM softwareProducts${whereSql}`, params);
  return { items: rows.map(mapRowToDto), page: { limit, offset, count: Number(countRow?.count ?? 0) } };
}

export async function create(dto: softwareCreateDto): Promise<softwareDto> {
  const result = await run(
    "INSERT INTO softwareProducts (name, version, licensetype, date) VALUES (?, ?, ?, ?)",
    [dto.name, dto.version, dto.licensetype, dto.date],
  );
  const created = await getById(result.lastID);
  if (!created) throw new Error("Created software could not be reloaded");
  return created;
}

export async function remove(id: number): Promise<boolean> {
  const result = await run("DELETE FROM softwareProducts WHERE id = ?", [id]);
  return result.changes > 0;
}
