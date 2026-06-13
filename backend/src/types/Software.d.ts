export type softwareDto = {
    id: number;
    name: string;
    version: number;
    licensetype: "Free" | "Commercial" | "Academic";
    date: string;
};
export type softwareRow = {
    id: number;
    name: string;
    version: number;
    licensetype: "Free" | "Commercial" | "Academic";
    date: string;
};
export type softwareUpdateDto = {
    id: number;
    name: string;
    version: number;
    licensetype: "Free" | "Commercial" | "Academic";
    date: string;
};
export type ListItemsQuery = {
    limit?: number;
    offset?: number;
    q?: string | null;
    sortBy?: "id" | "name" | "version" | "licensetype" | "date";
    sortDir?: "asc" | "desc";
};
export type listSoftware = {
    items: softwareDto[];
    page: {
        limit: number;
        offset: number;
        count: number;
    };
};
export type softwareCreateDto = {
    name: string;
    version: number;
    licensetype: "Free" | "Commercial" | "Academic";
    date: string;
};
//# sourceMappingURL=Software.d.ts.map