import type { Request } from "express";
import type { ListItemsQuery, requestUpdateDto, requestCreateDto } from "../types/request.js";
export declare function parseId(rawId: string | string[] | undefined): Promise<number | null>;
export declare function parseNumberOrDefault(rawValue: unknown, defaultValue: number): number;
export declare function parseListQuery(req: Request): ListItemsQuery;
export declare function create(req: Request): Promise<requestCreateDto | null>;
export declare function update(id: number | null, req: Request): Promise<requestUpdateDto | null>;
//# sourceMappingURL=requestService.d.ts.map