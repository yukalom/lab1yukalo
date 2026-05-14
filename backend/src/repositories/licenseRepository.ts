import { all, get, run } from "../db/db.js";
import type {
  licenseDto,
  licenseRow,
  licenseUpdateDto,
  ListItemsQuery,
  licenseCreateDto,
  listLicense
} from "../types/license.js";
import type { listRequest } from "../types/request.js";

  let data : licenseRow[] = [];

  const sortColumnMap = {
    software_id: "software_id",
    license_key: "license_key"
    } as const;
  
  
  function mapRowToDto(row: licenseRow): licenseDto{
      return {
        id: Number (row.id),
        software_id: Number (row.software_id),
        license_key: String (row.license_key)
          };
  }


  export async function getById(
    id: number 
  ): Promise < licenseDto | null > {
  const sql = `SELECT * FROM request
  WHERE id = ${id}`;
  const row = await get <licenseRow> (sql);
    if (!row) {
        return null;
    }
 return mapRowToDto (row);
  }




  export async function update(
      dto: licenseUpdateDto
  ):Promise <licenseDto | null> {
    const sql = `UPDATE license 
    SET software_id = ${dto.software_id},
    license_key = '${dto.license_key}'
    WHERE id = ${dto.id}`;

    const update = await run (sql);
    if (update.changes===0){
        return null;
    }
  
    return getById(dto.id);
  }



  export async function create(dto: licenseCreateDto): Promise<licenseDto> {
        const sql = `INSERT INTO license (software_id, license_key)
        VALUES (${dto.software_id}, '${dto.license_key}')`;
        const result = await run (sql);
        const created = await getById(result.lastID);
      if (!created){
          throw new Error("Created item could not be reloaded");
      }
      return created;
  }


  export async function remove(id: number): Promise<boolean> {
    const sql = `DELETE FROM license
    WHERE id = ${id}`;
    const result = await run (sql);
    return result.changes > 0;
  }

export async function getAll(query: ListItemsQuery): Promise<listLicense> {
    let sql = `SELECT * FROM license`

    const conditions: string[] = [];

  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);

  if (query.q && query.q.trim() !== "") {
    conditions.push(`title LIKE '%${query.q.trim()}%'`);
  }

  const sortBy = query.sortBy ?? "software_id";
  const sortColumn = sortColumnMap[sortBy] ?? "software_id";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";

    if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY ${sortColumn} ${sortDirection}`;
  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  const rows = await all<licenseRow>(sql);

  return {
    items: rows.map(mapRowToDto),
    page: {
      limit,
      offset,
      count: rows.length,
    },
  };
}