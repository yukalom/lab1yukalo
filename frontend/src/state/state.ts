// src/state/state.ts

import type {
    softwareDto,
    licenseDto,
    userDto,
    requestDto,
    ListItemsQuery,
} from "../../../common/types";

export type ListState<T> = {
    status: "loading" | "empty" | "error" | "success";
    message?: string;
    items: T[];
    query: {
        limit: number;
        offset: number;
        q: string;
        sortBy: string;
        sortDir: "asc" | "desc";
    };
    totalCount: number;
};

export type DetailsState<T> =
    | { status: "not_selected" }
    | { status: "loading" }
    | { status: "not_found" }
    | { status: "error"; message: string }
    | { status: "success"; item: T };

export type FormState = {
    isSubmitting: boolean;
    formError: string | null;
    fieldErrors: Record<string, string[]>;
    fields: Record<string, string>;
};

export type DeleteState = {
    isDeleting: boolean;
    error: string | null;
};

const PRODUCT_FIELDS = ["name", "version", "licensetype", "date"];
const LICENSE_FIELDS = ["software_id", "license_key"];
const USER_FIELDS = ["name", "login", "password"];
const REQUEST_FIELDS = ["software_id", "user_id", "request_date"];

export function makeFormState(fieldNames: string[]): FormState {
    return {
        isSubmitting: false,
        formError: null,
        fieldErrors: {},
        fields: Object.fromEntries(fieldNames.map((name) => [name, ""])),
    };
}

function makeDefaultQuery(defaultSortBy: string): ListState<any>["query"] {
    return {
        limit: 10,
        offset: 0,
        q: "",
        sortBy: defaultSortBy,
        sortDir: "asc"
    };
}

export const state = {
    auth: { currentUser: "demo", currentRole: "user" },
    activeModal: null as string | null,

    products: {
        status: "loading",
        items: [],
        query: makeDefaultQuery("name"),
        totalCount: 0
    } as ListState<softwareDto>,
    selectedProductId: null as number | null,
    productDetails: { status: "not_selected" } as DetailsState<softwareDto>,
    productCreateForm: makeFormState([...PRODUCT_FIELDS]),
    productEditForm: makeFormState([...PRODUCT_FIELDS]),
    productDeleteState: { isDeleting: false, error: null } as DeleteState,

    licenses: {
        status: "loading",
        items: [],
        query: makeDefaultQuery("license_key"),
        totalCount: 0
    } as ListState<licenseDto>,
    selectedLicenseId: null as number | null,
    licenseDetails: { status: "not_selected" } as DetailsState<licenseDto>,
    licenseCreateForm: makeFormState([...LICENSE_FIELDS]),
    licenseEditForm: makeFormState([...LICENSE_FIELDS]), // Keep synchronized for edits

    users: {
        status: "loading",
        items: [],
        query: makeDefaultQuery("name"),
        totalCount: 0
    } as ListState<userDto>,
    selectedUserId: null as number | null,
    userDetails: { status: "not_selected" } as DetailsState<userDto>,
    userCreateForm: makeFormState([...USER_FIELDS]),
    userEditForm: makeFormState([...USER_FIELDS]),

    requests: {
        status: "loading",
        items: [],
        query: makeDefaultQuery("request_date"),
        totalCount: 0
    } as ListState<requestDto>,
    selectedRequestId: null as number | null,
    requestDetails: { status: "not_selected" } as DetailsState<requestDto>,
    requestCreateForm: makeFormState([...REQUEST_FIELDS]),
    requestEditForm: makeFormState([...REQUEST_FIELDS]),
};

export function resetProductCreateForm(): void {
    state.productCreateForm = makeFormState([...PRODUCT_FIELDS]);
}

export function resetProductEditForm(): void {
    state.productEditForm = makeFormState([...PRODUCT_FIELDS]);
}

export function fillProductEditForm(item: softwareDto): void {
    state.productEditForm = {
        isSubmitting: false,
        formError: null,
        fieldErrors: {},
        fields: {
            name: item.name,
            version: String(item.version),
            licensetype: item.licensetype,
            date: item.date,
        },
    };
}

export function resetLicenseCreateForm(): void {
    state.licenseCreateForm = makeFormState([...LICENSE_FIELDS]);
}

export function resetLicenseEditForm(): void {
    state.licenseEditForm = makeFormState([...LICENSE_FIELDS]);
}

export function fillLicenseEditForm(item: licenseDto): void {
    state.licenseEditForm = {
        isSubmitting: false,
        formError: null,
        fieldErrors: {},
        fields: {
            software_id: String(item.software_id),
            license_key: item.license_key,
        },
    };
}

export function resetUserCreateForm(): void {
    state.userCreateForm = makeFormState([...USER_FIELDS]);
}

export function resetUserEditForm(): void {
    state.userEditForm = makeFormState([...USER_FIELDS]);
}

export function fillUserEditForm(item: userDto): void {
    state.userEditForm = {
        isSubmitting: false,
        formError: null,
        fieldErrors: {},
        fields: {
            name: item.name,
            login: item.login,
            password: item.password,
        },
    };
}

export function resetRequestCreateForm(): void {
    state.requestCreateForm = makeFormState([...REQUEST_FIELDS]);
}

export function resetRequestEditForm(): void {
    state.requestEditForm = makeFormState([...REQUEST_FIELDS]);
}

export function fillRequestEditForm(item: requestDto): void {
    state.requestEditForm = {
        isSubmitting: false,
        formError: null,
        fieldErrors: {},
        fields: {
            software_id: String(item.software_id),
            user_id: String(item.user_id),
            request_date: item.request_date,
        },
    };
}