import { all, get, run } from "../db/db.js";
import type {
  softwareDto,
  softwareRow,
  softwareUpdateDto,
  ListItemsQuery,
  softwareCreateDto,
  listSoftware
} from "../types/Software.js";

// function mapRowToDto(row: ItemRow): ItemDto {
//   return {
//     id: Number(row.id),
//     title: row.title,
//     price: Number(row.price),
//     createdAt: String(row.createdAt ?? row.created_at ?? ""),
//   };
// }

const sortColumnMap = {
    date: "date",
    name: "name",
    version: "version",
    licensetype: "licensetype"
  } as const;


function mapRowToDto(row: softwareRow): softwareDto{
    return {
        id: Number (row.id),
        name: String (row.name),
        version: Number (row.version),
        licensetype: row.licensetype,
        date:String (row.date)
        };
}

export async function getById(id: number):
Promise <softwareDto|null> {
    const sql = `SELECT * FROM softwareProducts 
    WHERE id=${id}`; 


    const row = await get<softwareRow>(sql);
    if (!row) {
        return null;
    }

    return mapRowToDto(row);
}

export async function update(
    dto: softwareUpdateDto
):Promise <softwareDto | null> {
    const sql = `UPDATE softwareProducts
    SET name = '${dto.name}', 
    version = ${dto.version}, 
    licensetype = '${dto.licensetype}',
    date = '${dto.date}'
    WHERE id = ${dto.id}
    `
    const update = await run(sql);

    if (update.changes === 0) {
    return null;
  }

  return getById(dto.id);
}

export async function getAll(query: ListItemsQuery): Promise<listSoftware> {
    let sql = `SELECT * FROM softwareProducts`

    const conditions: string[] = [];

  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);

  if (query.q && query.q.trim() !== "") {
    conditions.push(`title LIKE '%${query.q.trim()}%'`);
  }

  const sortBy = query.sortBy ?? "date";
  const sortColumn = sortColumnMap[sortBy] ?? "date";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";

    if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY ${sortColumn} ${sortDirection}`;
  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  const rows = await all<softwareRow>(sql);

  return {
    items: rows.map(mapRowToDto),
    page: {
      limit,
      offset,
      count: rows.length,
    },
  };
}

export async function create(dto: softwareCreateDto): Promise<softwareDto> {

  const sql = `
    INSERT INTO softwareProducts (name, version, licensetype, date)
    VALUES ('${dto.name}', ${dto.version}, '${dto.licensetype}', '${dto.date}')
  `;

  const result = await run(sql);

  const createdItem = await getById(result.lastID);

  if (!createdItem) {
    throw new Error("Created item could not be reloaded from database");
  }

  return createdItem;
}

export async function remove(id: number): Promise<boolean> {
  const sql = `
    DELETE FROM softwareProducts
    WHERE id = ${id}
  `;

  const result = await run(sql);

  return result.changes > 0;
}