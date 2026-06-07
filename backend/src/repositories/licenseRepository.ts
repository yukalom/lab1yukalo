import { all, get, run } from "../db/db.js";
import type { licenseDto, licenseRow, licenseUpdateDto, ListItemsQuery, licenseCreateDto, listLicense } from "../types/license.js";

const sortColumnMap = { software_id: "software_id", license_key: "license_key" } as const;
type CountRow = { count: number };

function mapRowToDto(row: licenseRow): licenseDto {
  return { id: Number(row.id), software_id: Number(row.software_id), license_key: String(row.license_key) };
}

export async function getById(id: number): Promise<licenseDto | null> {
  const row = await get<licenseRow>("SELECT * FROM license WHERE id = ?", [id]);
  return row ? mapRowToDto(row) : null;
}

export async function update(dto: licenseUpdateDto): Promise<licenseDto | null> {
  const result = await run("UPDATE license SET software_id = ?, license_key = ? WHERE id = ?", [dto.software_id, dto.license_key, dto.id]);
  return result.changes === 0 ? null : getById(dto.id);
}

export async function getAll(query: ListItemsQuery): Promise<listLicense> {
  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);
  const sortBy = query.sortBy ?? "software_id";
  const sortColumn = sortColumnMap[sortBy as keyof typeof sortColumnMap] ?? "software_id";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";
  const params: unknown[] = [];
  let whereSql = "";
  if (query.q && query.q.trim() !== "") {
    whereSql = " WHERE license_key LIKE ?";
    params.push(`%${query.q.trim()}%`);
  }
  const rows = await all<licenseRow>(`SELECT * FROM license${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  const countRow = await get<CountRow>(`SELECT COUNT(*) AS count FROM license${whereSql}`, params);
  return { items: rows.map(mapRowToDto), page: { limit, offset, count: Number(countRow?.count ?? 0) } };
}

export async function create(dto: licenseCreateDto): Promise<licenseDto> {
  const result = await run("INSERT INTO license (software_id, license_key) VALUES (?, ?)", [dto.software_id, dto.license_key]);
  const created = await getById(result.lastID);
  if (!created) throw new Error("Created license could not be reloaded");
  return created;
}

export async function remove(id: number): Promise<boolean> {
  const result = await run("DELETE FROM license WHERE id = ?", [id]);
  return result.changes > 0;
}
