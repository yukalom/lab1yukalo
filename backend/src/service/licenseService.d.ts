import type { Request } from "express";
import type { ListItemsQuery, licenseUpdateDto, licenseCreateDto } from "../types/license.js";
export declare function parseId(rawId: string | string[] | undefined): Promise<number | null>;
export declare function parseNumberOrDefault(rawValue: unknown, defaultValue: number): number;
export declare function parseListQuery(req: Request): ListItemsQuery;
export declare function create(req: Request): Promise<licenseCreateDto | null>;
export declare function update(id: number | null, req: Request): Promise<licenseUpdateDto | null>;
//# sourceMappingURL=licenseService.d.ts.map