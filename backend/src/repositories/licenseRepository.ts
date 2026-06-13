import { all, get, run } from "../db/db.js";
import type {
  licenseDto,
  licenseRow,
  licenseUpdateDto,
  ListItemsQuery,
  licenseCreateDto,
  listLicense
} from "../types/license.js";

type CountRow = { count: number };
type LicenseSortBy = NonNullable<ListItemsQuery["sortBy"]>;

const sortColumnMap: Record<LicenseSortBy, string> = {
  id: "id",
  software_id: "software_id",
  license_key: "license_key"
};

function mapRowToDto(row: licenseRow): licenseDto {
  return {
    id: Number(row.id),
    software_id: Number(row.software_id),
    license_key: String(row.license_key)
  };
}

export async function getById(id: number): Promise<licenseDto | null> {
  const row = await get<licenseRow>("SELECT * FROM license WHERE id = ?", [id]);
  return row ? mapRowToDto(row) : null;
}

export async function update(dto: licenseUpdateDto): Promise<licenseDto | null> {
  const result = await run(
    `UPDATE license SET software_id = ?, license_key = ? WHERE id = ?`,
    [dto.software_id, dto.license_key, dto.id]
  );
  if (result.changes === 0) return null;
  return getById(dto.id);
}

export async function create(dto: licenseCreateDto): Promise<licenseDto> {
  const result = await run(
    `INSERT INTO license (software_id, license_key) VALUES (?, ?)`,
    [dto.software_id, dto.license_key]
  );
  const created = await getById(result.lastID);
  if (!created) throw new Error("Created item could not be reloaded");
  return created;
}

export async function remove(id: number): Promise<boolean> {
  const result = await run("DELETE FROM license WHERE id = ?", [id]);
  return result.changes > 0;
}

export async function getAll(query: ListItemsQuery): Promise<listLicense> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);

  if (query.q && query.q.trim() !== "") {
    conditions.push("license_key LIKE ?");
    params.push(`%${query.q.trim()}%`);
  }

  const whereSql = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
  const sortBy: LicenseSortBy = query.sortBy ?? "software_id";
  const sortColumn = sortColumnMap[sortBy] ?? "software_id";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";

  const countRow = await get<CountRow>(`SELECT COUNT(*) AS count FROM license${whereSql}`, params);
  const rows = await all<licenseRow>(
    `SELECT * FROM license${whereSql} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`,
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
