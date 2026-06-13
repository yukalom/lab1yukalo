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

const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000`;
const SAFE_RETRY_STATUSES = new Set([429, 503]);
const MAX_SAFE_RETRIES = 2;
const CACHE_TTL_MS = 30_000;

const responseCache = new Map<string, { expiresAt: number; data: unknown }>();

function buildUrl(path: string): string {
    return `${API_BASE_URL}${path}`;
}

function getMethod(init: RequestInit): string {
    return (init.method ?? "GET").toUpperCase();
}

function isSafeMethod(method: string): boolean {
    return method === "GET" || method === "HEAD";
}

function getCacheKey(url: string, method: string): string {
    return `${method}:${url}`;
}

function invalidateApiCache(): void {
    responseCache.clear();
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelayMs(response: Response, attempt: number): number {
    const retryAfter = response.headers.get("Retry-After");
    const retryAfterSeconds = retryAfter ? Number(retryAfter) : NaN;

    if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
        return Math.min(retryAfterSeconds * 1000, 5000);
    }

    return 300 * 2 ** attempt;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isValidationErrors(value: unknown): value is ValidationErrors {
    if (!isRecord(value)) {
        return false;
    }

    return Object.values(value).every((entry) => {
        return Array.isArray(entry) && entry.every((item) => typeof item === "string");
    });
}

async function readJsonSafely(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function fetchWithRetry(url: string, init: RequestInit, method: string): Promise<Response> {
    let attempt = 0;

    while (true) {
        const response = await fetch(url, init);

        if (!isSafeMethod(method) || !SAFE_RETRY_STATUSES.has(response.status) || attempt >= MAX_SAFE_RETRIES) {
            return response;
        }

        await delay(getRetryDelayMs(response, attempt));
        attempt += 1;
    }
}

async function apiRequest<T>(
    path: string,
    init: RequestInit = {},
): Promise<ApiResult<T>> {
    const method = getMethod(init);
    const url = buildUrl(path);
    const cacheKey = getCacheKey(url, method);

    if (isSafeMethod(method)) {
        const cached = responseCache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
            return { ok: true, data: cached.data as T };
        }
        if (cached) {
            responseCache.delete(cacheKey);
        }
    }

    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");

    if (init.body) {
        headers.set("Content-Type", "application/json");
    }

    try {
        const response = await fetchWithRetry(url, { ...init, method, headers }, method);

        if (response.status === 204) {
            if (!isSafeMethod(method)) {
                invalidateApiCache();
            }
            return { ok: true, data: null as T };
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

        if (isSafeMethod(method)) {
            responseCache.set(cacheKey, {
                data,
                expiresAt: Date.now() + CACHE_TTL_MS,
            });
        } else {
            invalidateApiCache();
        }

        return { ok: true, data: data as T };
    } catch {
        return {
            ok: false,
            error: {
                kind: "network",
                message: "Could not complete the request. Possible network problem or CORS blocking.",
            },
        };
    }
}

export type { ApiError, ApiResult, ValidationErrors };
export { apiRequest, invalidateApiCache };
