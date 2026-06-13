import type { requestDto, requestUpdateDto, ListItemsQuery, requestCreateDto, listRequest } from "../types/request.js";
export declare function getById(id: number): Promise<requestDto | null>;
export declare function update(dto: requestUpdateDto): Promise<requestDto | null>;
export declare function getAll(query: ListItemsQuery): Promise<listRequest>;
export declare function create(dto: requestCreateDto): Promise<requestDto>;
export declare function remove(id: number): Promise<boolean>;
//# sourceMappingURL=requestRepositoryBE.d.ts.map