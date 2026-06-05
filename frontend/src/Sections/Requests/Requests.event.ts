// src/Sections/Requests/Requests.event.ts

import * as RequestApi from "../../Api/RequestApi";
import {
    state as originalState,
    fillRequestEditForm,
    resetRequestCreateForm,
    resetRequestEditForm
} from "../../state/state";

// Local type-casting overlay to access activeModal safely without altering state.ts
const state = originalState as typeof originalState & { activeModal?: string | null };

type RenderTriggerCallback = () => void;
let searchDebounceTimeout: ReturnType<typeof setTimeout> | null = null;

export function attachRequestEventListeners(rootContainer: HTMLElement, triggerAppRender: RenderTriggerCallback): void {

    async function refreshRequestsListData() {
        state.requests.status = "loading";
        triggerAppRender();

        const result = await RequestApi.getRequests({
            limit: state.requests.query.limit,
            offset: state.requests.query.offset,
            q: state.requests.query.q || null,
            sortBy: state.requests.query.sortBy,
            sortDir: state.requests.query.sortDir
        });

        if (!result.ok) {
            state.requests = {
                ...state.requests,
                status: "error",
                message: result.error.message,
                items: []
            };
        } else {
            state.requests = {
                ...state.requests,
                status: result.data.items.length === 0 ? "empty" : "success",
                items: result.data.items,
                totalCount: result.data.page.count
            };
        }
        triggerAppRender();
    }

    // --- LIVE INPUT EVENT (DEBOUNCED SEARCH & DYNAMIC FORM TRACKING) ---
    rootContainer.addEventListener("input", (e) => {
        const target = e.target as HTMLElement;
        if (target.id === "input-search-requests") {
            const currentSearchValue = (target as HTMLInputElement).value;

            if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);

            searchDebounceTimeout = setTimeout(() => {
                state.requests.query.q = currentSearchValue;
                state.requests.query.offset = 0;
                refreshRequestsListData();
            }, 355);
        }

        if (target.tagName === "INPUT" || target.tagName === "SELECT") {
            const formElement = (target as HTMLInputElement | HTMLSelectElement).form;
            if (formElement?.id === "form-create-request") {
                const nameAttr = target.getAttribute("name");
                if (nameAttr) {
                    state.requestCreateForm.fields[nameAttr] = (target as HTMLInputElement).value;
                }
            }
            if (formElement?.id === "form-edit-request") {
                const nameAttr = target.getAttribute("name");
                if (nameAttr) {
                    state.requestEditForm.fields[nameAttr] = (target as HTMLInputElement).value;
                }
            }
        }
    });

    // --- TABLE SORTING CLICKS ---
    rootContainer.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const sortHeader = target.closest("#table-requests-list th[data-sort-field]");

        if (sortHeader) {
            const field = sortHeader.getAttribute("data-sort-field")!;
            const currentDir = state.requests.query.sortDir;

            state.requests.query.sortBy = field;
            state.requests.query.sortDir = currentDir === "asc" ? "desc" : "asc";
            state.requests.query.offset = 0;

            refreshRequestsListData();
        }
    });

    // --- ACTIONS AND SELECTIONS CLICK ROUTER ---
    rootContainer.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement;

        if (target.id === "btn-trigger-create-request") {
            resetRequestCreateForm();
            state.activeModal = "create-request";
            triggerAppRender();
            return;
        }

        if (target.classList.contains("btn-edit-request")) {
            e.stopPropagation();
            const requestId = Number(target.dataset.requestId);
            state.selectedRequestId = requestId;

            const found = state.requests.items.find(r => r.id === requestId);
            if (found) {
                fillRequestEditForm(found);
                state.activeModal = "edit-request";
                triggerAppRender();
            }
            return;
        }

        // Delete Request
        if (target.classList.contains("btn-delete-request")) {
            e.stopPropagation();
            const requestId = Number(target.dataset.requestId);
            if (!confirm("Are you sure you want to delete this request?")) return;

            const result = await RequestApi.deleteRequest(requestId);
            if (result.ok) {
                if (state.selectedRequestId === requestId) {
                    state.selectedRequestId = null;
                    state.requestDetails = { status: "not_selected" };
                }
                await refreshRequestsListData();
            } else {
                alert(`Failed to delete request: ${result.error.message}`);
            }
            return;
        }

        const clickableRow = target.closest("#table-requests-list .clickable-row");
        if (clickableRow && !target.closest("button") && !target.classList.contains("btn")) {
            const requestId = Number((clickableRow as HTMLElement).dataset.requestId);

            if (state.selectedRequestId === requestId) {
                state.selectedRequestId = null;
                state.requestDetails = { status: "not_selected" };
            } else {
                state.selectedRequestId = requestId;
                state.requestDetails = { status: "loading" };
                triggerAppRender();

                const result = await RequestApi.getRequestById(requestId);
                if (state.selectedRequestId === requestId) {
                    if (result.ok) {
                        state.requestDetails = { status: "success", item: result.data };
                    } else if (result.error.status === 404) {
                        state.requestDetails = { status: "not_found" };
                    } else {
                        state.requestDetails = { status: "error", message: result.error.message };
                    }
                }
            }
            triggerAppRender();
            return;
        }

        if (target.id === "btn-close-request-details") {
            state.selectedRequestId = null;
            state.requestDetails = { status: "not_selected" };
            triggerAppRender();
            return;
        }

        if (target.id === "btn-cancel-create-request") {
            state.activeModal = null;
            resetRequestCreateForm();
            triggerAppRender();
            return;
        }

        if (target.id === "btn-cancel-edit-request") {
            state.activeModal = null;
            resetRequestEditForm();
            triggerAppRender();
            return;
        }

        if (target.id === "btn-request-next-page") {
            const currentQuery = state.requests.query;
            const nextOffset = currentQuery.offset + currentQuery.limit;
            if (nextOffset < state.requests.totalCount) {
                state.requests.query.offset = nextOffset;
                refreshRequestsListData();
            }
            return;
        }

        if (target.id === "btn-request-prev-page") {
            const currentQuery = state.requests.query;
            const prevOffset = currentQuery.offset - currentQuery.limit;
            if (prevOffset >= 0) {
                state.requests.query.offset = prevOffset;
                refreshRequestsListData();
            }
            return;
        }
    });

    // --- FORM SUBMISSIONS ---
    rootContainer.addEventListener("submit", async (e) => {
        const target = e.target as HTMLFormElement;

        if (target.id === "form-create-request") {
            e.preventDefault();
            state.requestCreateForm.isSubmitting = true;
            state.requestCreateForm.formError = null;
            state.requestCreateForm.fieldErrors = {};
            triggerAppRender();

            const payload = {
                software_id: Number(state.requestCreateForm.fields.software_id || 0),
                user_id: Number(state.requestCreateForm.fields.user_id || 0),
                request_date: state.requestCreateForm.fields.request_date || ""
            };

            const result = await RequestApi.createRequest(payload);

            if (result.ok) {
                state.activeModal = null;
                resetRequestCreateForm();
                await refreshRequestsListData();
            } else {
                state.requestCreateForm.isSubmitting = false;
                if (result.error.kind === "http" && result.error.errors) {
                    state.requestCreateForm.fieldErrors = result.error.errors;
                } else {
                    state.requestCreateForm.formError = result.error.message;
                }
                triggerAppRender();
            }
        }

        if (target.id === "form-edit-request") {
            e.preventDefault();
            if (state.selectedRequestId === null) return;

            state.requestEditForm.isSubmitting = true;
            state.requestEditForm.formError = null;
            state.requestEditForm.fieldErrors = {};
            triggerAppRender();

            const payload = {
                id: state.selectedRequestId,
                software_id: Number(state.requestEditForm.fields.software_id || 0),
                user_id: Number(state.requestEditForm.fields.user_id || 0),
                request_date: state.requestEditForm.fields.request_date || ""
            };

            const result = await RequestApi.updateRequest(state.selectedRequestId, payload);

            if (result.ok) {
                state.activeModal = null;
                resetRequestEditForm();
                if (state.selectedRequestId === result.data.id) {
                    state.requestDetails = { status: "success", item: result.data };
                }
                await refreshRequestsListData();
            } else {
                state.requestEditForm.isSubmitting = false;
                if (result.error.kind === "http" && result.error.errors) {
                    state.requestEditForm.fieldErrors = result.error.errors;
                } else {
                    state.requestEditForm.formError = result.error.message;
                }
                triggerAppRender();
            }
        }
    });
}