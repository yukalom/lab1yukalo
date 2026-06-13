import type { userDto, userUpdateDto, ListItemsQuery, userCreateDto, listUser } from "../types/user.js";
export declare function getById(id: number): Promise<userDto | null>;
export declare function update(dto: userUpdateDto): Promise<userDto | null>;
export declare function create(dto: userCreateDto): Promise<userDto>;
export declare function remove(id: number): Promise<boolean>;
export declare function getAll(query: ListItemsQuery): Promise<listUser>;
//# sourceMappingURL=userRepositoryBE.d.ts.map