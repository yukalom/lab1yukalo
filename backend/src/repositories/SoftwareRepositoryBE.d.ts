import type { softwareDto, softwareUpdateDto, ListItemsQuery, softwareCreateDto, listSoftware } from "../types/Software.js";
export declare function getById(id: number): Promise<softwareDto | null>;
export declare function update(dto: softwareUpdateDto): Promise<softwareDto | null>;
export declare function getAll(query: ListItemsQuery): Promise<listSoftware>;
export declare function create(dto: softwareCreateDto): Promise<softwareDto>;
export declare function remove(id: number): Promise<boolean>;
//# sourceMappingURL=SoftwareRepositoryBE.d.ts.map