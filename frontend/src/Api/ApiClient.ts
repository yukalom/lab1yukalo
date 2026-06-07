type ValidationErrors = Record<string, string[]>;

type ApiErrorKind = "http" | "network" | "parse";

type ApiError = {
    kind: ApiErrorKind;
    status?: number;
    message: string;
    code?: string;
    errors?: ValidationErrors;
};

type ApiSuccess<T> = {
    ok: true;
    data: T;
};

type ApiResult<T> = ApiSuccess<T> | { ok: false; error: ApiError };

const API_BASE_URL = "http://localhost:3000";

function buildUrl(path: string): string {
    return `${API_BASE_URL}${path}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isValidationErrors(value: unknown): value is ValidationErrors {
    if (!isRecord(value)) {
        return false;
    }

    return Object.values(value).every((entry) => {
        return (
            Array.isArray(entry) && entry.every((item) => typeof item === "string")
        );
    });
}

async function readJsonSafely(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function apiRequest<T>(
    path: string,
    init: RequestInit = {},
): Promise<ApiResult<T>> {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");

    if (init.body) {
        headers.set("Content-Type", "application/json");
    }

    const currentUserId = localStorage.getItem("currentDemoUserId");
    if (currentUserId) {
        headers.set("X-Demo-UserId", currentUserId);
    }

    try {
        const response = await fetch(buildUrl(path), {
            ...init,
            headers,
        });

        if (response.status === 204) {
            return {
                ok: true,
                data: null as T,
            };
        }

        const contentType = response.headers.get("content-type") ?? "";
        const isJsonResponse = contentType.includes("application/json");

        if (!isJsonResponse) {
            return {
                ok: false,
                error: {
                    kind: "parse",
                    status: response.status,
                    message: "Could not read server response as JSON.",
                },
            };
        }

        const data = await readJsonSafely(response);

        if (!response.ok) {
            let message = "Server returned an error response.";
            let code: string | undefined;
            let errors: ValidationErrors | undefined;

            if (isRecord(data)) {
                if (typeof data.message === "string") {
                    message = data.message;
                }

                if (typeof data.code === "string") {
                    code = data.code;
                }

                if (isValidationErrors(data.errors)) {
                    errors = data.errors;
                }
            }

            return {
                ok: false,
                error: {
                    kind: "http",
                    status: response.status,
                    message,
                    code,
                    errors,
                },
            };
        }

        return {
            ok: true,
            data: data as T,
        };
    } catch {
        return {
            ok: false,
            error: {
                kind: "network",
                message:
                    "Could not complete the request. Possible network problem or CORS blocking.",
            },
        };
    }
}

export type { ApiError, ApiResult, ValidationErrors };
export { apiRequest };