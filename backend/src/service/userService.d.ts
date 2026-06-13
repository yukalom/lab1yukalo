import type { Request } from "express";
import type { ListItemsQuery, userUpdateDto, userCreateDto } from "../types/user.js";
export declare function parseId(rawId: string | string[] | undefined): Promise<number | null>;
export declare function parseNumberOrDefault(rawValue: unknown, defaultValue: number): number;
export declare function parseListQuery(req: Request): ListItemsQuery;
export declare function create(req: Request): Promise<userCreateDto | null>;
export declare function update(id: number | null, req: Request): Promise<userUpdateDto | null>;
//# sourceMappingURL=userService.d.ts.map