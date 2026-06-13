import type { softwareUpdateDto, ListItemsQuery, softwareCreateDto } from "../types/Software.js";
import type { Request } from "express";
export declare function parseId(rawId: string | string[] | undefined): Promise<number | null>;
export declare function parseNumberOrDefault(rawValue: unknown, defaultValue: number): number;
export declare function parseListQuery(req: Request): ListItemsQuery;
export declare function create(req: Request): Promise<softwareCreateDto | null>;
export declare function update(id: number | null, req: Request): Promise<softwareUpdateDto | null>;
//# sourceMappingURL=softwareService.d.ts.map