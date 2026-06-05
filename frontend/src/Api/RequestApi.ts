import { apiRequest } from "./ApiClient";
import type { ApiResult } from "./ApiClient";
import type {
    listRequest,
    requestDto,
    requestCreateDto,
    requestUpdateDto,
    ListItemsQuery
} from "../../../common/types";

export function getRequests(query?: ListItemsQuery): Promise<ApiResult<listRequest>> {
    const params = new URLSearchParams();

    if (query) {
        if (query.q) params.append("q", query.q);
        if (query.sortBy) params.append("sortBy", query.sortBy);
        if (query.sortDir) params.append("sortDir", query.sortDir);
    }

    const queryString = params.toString();
    return apiRequest<listRequest>(`/api/request${queryString ? `?${queryString}` : ""}`);
}

export function getRequestById(id: number): Promise<ApiResult<requestDto>> {
    return apiRequest<requestDto>(`/api/request/${id}`);
}

export function createRequest(dto: requestCreateDto): Promise<ApiResult<requestDto>> {
    return apiRequest<requestDto>("/api/request", {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export function updateRequest(id: number, dto: requestUpdateDto): Promise<ApiResult<requestDto>> {
    return apiRequest<requestDto>(`/api/request/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
}

export function deleteRequest(id: number): Promise<ApiResult<{ success: boolean }>> {
    return apiRequest<{ success: boolean }>(`/api/request/${id}`, {
        method: "DELETE",
    });
}