import { all, get, run } from "../db/db.js";
import type {
  userDto,
  userRow,
  userUpdateDto,
  ListItemsQuery,
  userCreateDto,
  listUser
} from "../types/user.js";

  let data : userRow[] = [];

  const sortColumnMap = {
      name: "name",
      login: "login",
      password: "password"
    } as const;
  
  
  function mapRowToDto(row: userRow): userDto{
      return {
        id: Number (row.id),
        name: String (row.name),
        login: String (row.login),
        password: String (row.password)
          };
  }


  export async function getById(
    id: number 
  ): Promise < userDto | null > {
    const sql = `SELECT * FROM user
    WHERE id=${id}`;

    const row = await get<userRow>(sql);
    if (!row) {
        return null;
    }
 return mapRowToDto (row);
  }


  export async function update(
      dto: userUpdateDto
  ):Promise <userDto | null> {
    const sql = `UPDATE license
    SET name = '${dto.name}',
    login = '${dto.login}',
    password = '${dto.password}'
    WHERE id = '${dto.id}'
    `
    const update = await run (sql);

    if (update.changes === 0){
        return null;
    }
  
    return getById(dto.id);
  }

  
  export async function create(dto: userCreateDto): Promise<userDto> {
     
    const sql = `
    INSERT INTO user (name, login, password)
    VALUES ('${dto.name}', '${dto.login}', '${dto.password}')`;

    const result = await run (sql);

    const created = await getById(result.lastID);

      if (!created){
          throw new Error("Created item could not be reloaded");
      }
      return created;
  }


  export async function remove(id: number): Promise<boolean> {
    const sql = `
    DELETE FROM user
    WHERE is = ${id}`;

    const result = await run (sql);
    return result.changes > 0;
  }

export async function getAll(query: ListItemsQuery): Promise<listUser> {
    let sql = `SELECT * FROM user`

    const conditions: string[] = [];

  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);

  if (query.q && query.q.trim() !== "") {
    conditions.push(`title LIKE '%${query.q.trim()}%'`);
  }

  const sortBy = query.sortBy ?? "name";
  const sortColumn = sortColumnMap[sortBy] ?? "name";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";

    if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY ${sortColumn} ${sortDirection}`;
  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  const rows = await all<userRow>(sql);

  return {
    items: rows.map(mapRowToDto),
    page: {
      limit,
      offset,
      count: rows.length,
    },
  };
}