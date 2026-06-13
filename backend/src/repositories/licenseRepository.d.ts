import type { licenseDto, licenseUpdateDto, ListItemsQuery, licenseCreateDto, listLicense } from "../types/license.js";
export declare function getById(id: number): Promise<licenseDto | null>;
export declare function update(dto: licenseUpdateDto): Promise<licenseDto | null>;
export declare function create(dto: licenseCreateDto): Promise<licenseDto>;
export declare function remove(id: number): Promise<boolean>;
export declare function getAll(query: ListItemsQuery): Promise<listLicense>;
//# sourceMappingURL=licenseRepository.d.ts.map