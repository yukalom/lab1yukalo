import { all, get, run } from "../db/db.js";
import type {
  requestDto,
  requestRow,
  requestUpdateDto,
  ListItemsQuery,
  requestCreateDto,
  listRequest
} from "../types/request.js";

 let data : requestRow[] = [];

const sortColumnMap = {
  software_id: "software_id",
  user_id: "user_id",
  request_date: "request_date"
  } as const;


function mapRowToDto(row: requestRow): requestDto{
    return {
        id: Number (row.id),
        software_id: Number (row.software_id),
        user_id: Number (row.user_id),
        request_date: String (row.request_date),
        };
}

export async function getById(id: number):
Promise <requestDto|null> {
    const sql = `SELECT * FROM request 
    WHERE id = ${id}`;
    const row = await get <requestRow> (sql);
    if (!row){
        return null;
    }

    return mapRowToDto(row);
}

export async function update(
    dto: requestUpdateDto
):Promise <requestDto | null> {
    const sql = `UPDATE request
    SET request_date = '${dto.request_date}',
    software_id = ${dto.software_id},
    user_id = ${dto.user_id} 
    WHERE id = ${dto.id}`;

    const update = await run (sql);
    if (update.changes===0){
        return null;
    }

  return getById(dto.id);
}

export async function getAll(query: ListItemsQuery): Promise<listRequest> {
    let sql = `SELECT * FROM request`

    const conditions: string[] = [];

  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);

  if (query.q && query.q.trim() !== "") {
    conditions.push(`title LIKE '%${query.q.trim()}%'`);
  }

  const sortBy = query.sortBy ?? "user_id";
  const sortColumn = sortColumnMap[sortBy] ?? "user_id";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";

    if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY ${sortColumn} ${sortDirection}`;
  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  const rows = await all<requestRow>(sql);

  return {
    items: rows.map(mapRowToDto),
    page: {
      limit,
      offset,
      count: rows.length,
    },
  };
}

export async function create(dto: requestCreateDto): Promise<requestDto> {
    const sql = `INSERT INTO request (software_id, user_id, request_date) 
    VALUES (${dto.software_id}, ${dto.user_id}, '${dto.request_date}')`;
    const result = await run (sql);
    const created = await getById(result.lastID);
    if (!created){
        throw new Error("Created item could not be reloaded");
    }
    return created;
}

export async function remove(id: number): Promise<boolean> {
    const sql = `DELETE FROM request 
    WHERE id = ${id}`;
    const result = await run (sql);
  return result.changes > 0;
}