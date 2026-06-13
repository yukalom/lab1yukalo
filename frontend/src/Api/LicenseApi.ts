import { apiRequest } from "./ApiClient";
import type { ApiResult } from "./ApiClient";
import type {
    listLicense,
    licenseDto,
    licenseCreateDto,
    licenseUpdateDto,
    ListItemsQuery
} from "../../../common/types";

export function getLicenses(query?: ListItemsQuery): Promise<ApiResult<listLicense>> {
    const params = new URLSearchParams();

    if (query) {
        if (query.limit !== undefined) params.append("limit", query.limit.toString());
        if (query.offset !== undefined) params.append("offset", query.offset.toString());
        if (query.q) params.append("q", query.q);
        if (query.sortBy) params.append("sortBy", query.sortBy);
        if (query.sortDir) params.append("sortDir", query.sortDir);
    }

    const queryString = params.toString();
    return apiRequest<listLicense>(`/api/license${queryString ? `?${queryString}` : ""}`);
}

export function getLicenseById(id: number): Promise<ApiResult<licenseDto>> {
    return apiRequest<licenseDto>(`/api/license/${id}`);
}

export function createLicense(dto: licenseCreateDto): Promise<ApiResult<licenseDto>> {
    return apiRequest<licenseDto>("/api/license", {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export function updateLicense(id: number, dto: licenseUpdateDto): Promise<ApiResult<licenseDto>> {
    return apiRequest<licenseDto>(`/api/license/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
}

export function deleteLicense(id: number): Promise<ApiResult<{ success: boolean }>> {
    return apiRequest<{ success: boolean }>(`/api/license/${id}`, {
        method: "DELETE",
    });
}