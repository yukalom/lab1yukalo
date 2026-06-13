export type requestDto = {
    id: number;
    software_id: number;
    user_id: number;
    request_date: string;
};
export type requestRow = {
    id: number;
    software_id: number;
    user_id: number;
    request_date: string;
};
export type requestUpdateDto = {
    id: number;
    software_id: number;
    user_id: number;
    request_date: string;
};
export type ListItemsQuery = {
    limit?: number;
    offset?: number;
    q?: string | null;
    sortBy?: "id" | "software_id" | "user_id" | "request_date";
    sortDir?: "asc" | "desc";
};
export type listRequest = {
    items: requestDto[];
    page: {
        limit: number;
        offset: number;
        count: number;
    };
};
export type requestCreateDto = {
    software_id: number;
    user_id: number;
    request_date: string;
};
//# sourceMappingURL=request.d.ts.map