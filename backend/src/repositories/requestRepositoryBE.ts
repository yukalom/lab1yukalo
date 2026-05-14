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
    const row = data.find(item => item.id === id);
    if (!row){
        return null;
    }

    return mapRowToDto(row);
}

export async function update(
    dto: requestUpdateDto
):Promise <requestDto | null> {
    let row = data.find(item => item.id === dto.id);
    if (!row){
        return null;
    }
    row.software_id = dto.software_id;
    row.user_id = dto.user_id;
    row.request_date = dto.request_date;


  return getById(dto.id);
}

export async function getAll(query: ListItemsQuery): Promise<listRequest> {
    const conditions: string[] = [];

  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);

  if (query.q && query.q.trim() !== "") {
    conditions.push(`title LIKE '%${query.q.trim()}%'`);
  }

  const sortBy = query.sortBy ?? "user_id";
  const sortColumn = sortColumnMap[sortBy] ?? "user_id";
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

export async function create(dto: requestCreateDto): Promise<requestDto> {
    let last_old;
    if (data.length === 0){
        last_old = 0;
    }
     else {
        last_old = Number(data.lastIndexOf);
    }
    data.push({id:last_old+1, software_id: dto.software_id, user_id : dto.user_id, request_date:dto.request_date})
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