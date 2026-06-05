import { apiRequest } from "./ApiClient";
import type { ApiResult } from "./ApiClient";
import type {
    listSoftware,
    softwareDto,
    softwareCreateDto,
    softwareUpdateDto,
    ListItemsQuery
} from "../../../common/types";

function getSoftware(query?: ListItemsQuery): Promise<ApiResult<listSoftware>> {
    const params = new URLSearchParams();

    if (query) {
        if (query.limit !== undefined) params.append("limit", query.limit.toString());
        if (query.offset !== undefined) params.append("offset", query.offset.toString());
        if (query.q) params.append("q", query.q);
        if (query.sortBy) params.append("sortBy", query.sortBy);
        if (query.sortDir) params.append("sortDir", query.sortDir);
    }

    const queryString = params.toString();
    // Return the response directly ensuring 'page' attributes (count, offset, limit) remain intact
    return apiRequest<listSoftware>(`/api/software${queryString ? `?${queryString}` : ""}`);
}

function getSoftwareById(id: number): Promise<ApiResult<softwareDto>> {
    return apiRequest<softwareDto>(`/api/software/${id}`);
}

function createSoftware(dto: softwareCreateDto): Promise<ApiResult<softwareDto>> {
    return apiRequest<softwareDto>("/api/software", {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

function updateSoftware(id: number, dto: softwareUpdateDto): Promise<ApiResult<softwareDto>> {
    return apiRequest<softwareDto>(`/api/software/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
}

function deleteSoftware(id: number): Promise<ApiResult<null>> {
    return apiRequest<null>(`/api/software/${id}`, {
        method: "DELETE",
    });
}

export { createSoftware, deleteSoftware, getSoftwareById, getSoftware, updateSoftware };