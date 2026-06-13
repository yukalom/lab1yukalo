export type licenseDto = {
    id: number;
    software_id: number;
    license_key: string;
};
export type licenseRow = {
    id: number;
    software_id: number;
    license_key: string;
};
export type licenseUpdateDto = {
    id: number;
    software_id: number;
    license_key: string;
};
export type ListItemsQuery = {
    limit?: number;
    offset?: number;
    q?: string | null;
    sortBy?: "id" | "software_id" | "license_key";
    sortDir?: "asc" | "desc";
};
export type listLicense = {
    items: licenseDto[];
    page: {
        limit: number;
        offset: number;
        count: number;
    };
};
export type licenseCreateDto = {
    software_id: number;
    license_key: string;
};
//# sourceMappingURL=license.d.ts.map