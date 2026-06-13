// import { all, get, run } from "../db/db.js";
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

    let data : softwareRow[] = [];

const sortColumnMap = {
    id: "id",
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
    const row = data.find(item => item.id === id);
    if (!row){
        return null;
    }

    return mapRowToDto(row);
}

export async function update(
    dto: softwareUpdateDto
):Promise <softwareDto | null> {
    let row = data.find(item => item.id === dto.id);
    if (!row){
        return null;
    }
    row.name = dto.name;
    row.version = dto.version;
    row.date = dto.date;
    row.licensetype = dto.licensetype;

  return getById(dto.id);
}

export async function getAll(query: ListItemsQuery): Promise<listSoftware> {
    const conditions: string[] = [];

  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);

  if (query.q && query.q.trim() !== "") {
    conditions.push(`name LIKE '%${query.q.trim()}%'`);
  }

  const sortBy = query.sortBy ?? "date";
  const sortColumn = sortColumnMap[sortBy] ?? "date";
  const sortDirection = query.sortDir === "asc" ? "ASC" : "DESC";

  return {
    items: data.map(row => mapRowToDto(row)),
    page: {
      limit,
      offset,
      count: data.length,
    },
  };
}

export async function create(dto: softwareCreateDto): Promise<softwareDto> {
    let last_old;
    if (data.length === 0){
        last_old = 0;
    }
     else {
        last_old = Number(data.lastIndexOf);
    }
    data.push({id:last_old+1, name: dto.name, version : dto.version, licensetype:dto.licensetype, date: dto.date})
    const created = await getById(Number(last_old)+1);
    if (!created){
        throw new Error("Created item could not be reloaded");
    }
    return created;
}

export async function remove(id: number): Promise<boolean> {
  data.splice(data.indexOf(data.find(item => item.id === id)!, 0), 1);
  return true;
}