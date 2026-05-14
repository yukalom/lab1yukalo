import type {
  licenseDto,
  licenseRow,
  licenseUpdateDto,
  ListItemsQuery,
  licenseCreateDto,
  listLicense
} from "../types/license.js";

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
  const row = data.find(item => item.id === id);
    if (!row) {
        return null;
    }
 return mapRowToDto (row);
  }

  export async function update(
      dto: licenseUpdateDto
  ):Promise <licenseDto | null> {
      let row = data.find(item => item.id === dto.id);
      if (!row){
          return null;
      }
      row.software_id = dto.software_id;
      row.license_key = dto.license_key;
  
    return getById(dto.id);
  }

  export async function create(dto: licenseCreateDto): Promise<licenseDto> {
      let last_old;
      if (data.length === 0){
          last_old = 0;
      }
       else {
          last_old = Number(data.lastIndexOf);
      }
      data.push({id:last_old+1, software_id: dto.software_id, license_key : dto.license_key})
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

  export async function getAll(
    query: ListItemsQuery): Promise<listLicense>
  {  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const offset = Math.max(Number(query.offset ?? 0), 0);
   return {
   items: data.map(row => mapRowToDto(row)),
    page: {
      limit,
      offset,
      count: data.length,
    },
  };
  }