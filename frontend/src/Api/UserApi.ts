import { apiRequest } from "./ApiClient";
import type { ApiResult } from "./ApiClient";
import type {
    listUser,
    userDto,
    userCreateDto,
    userUpdateDto,
    ListItemsQuery
} from "../../../common/types";

export function getUsers(query?: ListItemsQuery): Promise<ApiResult<listUser>> {
    const params = new URLSearchParams();

    if (query) {
        if (query.q) params.append("q", query.q);
        if (query.sortBy) params.append("sortBy", query.sortBy);
        if (query.sortDir) params.append("sortDir", query.sortDir);
    }

    const queryString = params.toString();
    return apiRequest<listUser>(`/api/user${queryString ? `?${queryString}` : ""}`);
}

export function getUserById(id: number): Promise<ApiResult<userDto>> {
    return apiRequest<userDto>(`/api/user/${id}`);
}

export function createUser(dto: userCreateDto): Promise<ApiResult<userDto>> {
    return apiRequest<userDto>("/api/user", {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export function updateUser(id: number, dto: userUpdateDto): Promise<ApiResult<userDto>> {
    return apiRequest<userDto>(`/api/user/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
}

export function deleteUser(id: number): Promise<ApiResult<{ success: boolean }>> {
    return apiRequest<{ success: boolean }>(`/api/user/${id}`, {
        method: "DELETE",
    });
}