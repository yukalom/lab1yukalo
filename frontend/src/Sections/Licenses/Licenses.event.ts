// src/Sections/Licenses/Licenses.event.ts

import * as LicenseApi from "../../Api/LicenseApi";
import {
    state as originalState,
    fillLicenseEditForm,
    resetLicenseCreateForm,
    resetLicenseEditForm
} from "../../state/state";

// Local type-casting overlay to safely access layout context without altering state.ts
const state = originalState as typeof originalState & { activeModal?: string | null };

type RenderTriggerCallback = () => void;
let searchDebounceTimeout: ReturnType<typeof setTimeout> | null = null;

export function attachLicenseEventListeners(rootContainer: HTMLElement, triggerAppRender: RenderTriggerCallback): void {

    // Helper task to fetch updated table contents using current query state parameters
    async function refreshLicensesListData() {
        state.licenses.status = "loading";
        triggerAppRender();

        const result = await LicenseApi.getLicenses({
            limit: state.licenses.query.limit,
            offset: state.licenses.query.offset,
            q: state.licenses.query.q || null,
            sortBy: state.licenses.query.sortBy,
            sortDir: state.licenses.query.sortDir
        });

        if (!result.ok) {
            state.licenses = {
                ...state.licenses,
                status: "error",
                message: result.error.message,
                items: []
            };
        } else {
            state.licenses = {
                ...state.licenses,
                status: result.data.items.length === 0 ? "empty" : "success",
                items: result.data.items,
                totalCount: result.data.page.count
            };
        }
        triggerAppRender();
    }

    // --- LIVE INPUT EVENT (DEBOUNCED SEARCH FILTERS ONLY) ---
    rootContainer.addEventListener("input", (e) => {
        const target = e.target as HTMLElement;
        if (target.id === "input-search-licenses") {
            const currentSearchValue = (target as HTMLInputElement).value;

            if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);

            searchDebounceTimeout = setTimeout(() => {
                state.licenses.query.q = currentSearchValue;
                state.licenses.query.offset = 0;
                refreshLicensesListData();
            }, 355);
        }
    });

    // --- TABLE HEADERS SORTING CLICKS ---
    rootContainer.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const sortHeader = target.closest("#table-licenses-list th[data-sort-field]");

        if (sortHeader) {
            const field = sortHeader.getAttribute("data-sort-field")!;
            const currentDir = state.licenses.query.sortDir;

            state.licenses.query.sortBy = field;
            state.licenses.query.sortDir = currentDir === "asc" ? "desc" : "asc";
            state.licenses.query.offset = 0;

            refreshLicensesListData();
        }
    });

    // --- BUTTON ACTIONS AND SELECTIONS ROUTER ---
    rootContainer.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement;

        // Trigger Create Modal Popover
        if (target.id === "btn-trigger-create-license") {
            resetLicenseCreateForm();
            state.activeModal = "create-license";
            triggerAppRender();
            return;
        }

        // Trigger Edit Modal Popover
        if (target.classList.contains("btn-edit-license")) {
            e.stopPropagation();
            const licenseId = Number(target.dataset.licenseId);
            state.selectedLicenseId = licenseId;

            const found = state.licenses.items.find(l => l.id === licenseId);
            if (found) {
                fillLicenseEditForm(found);
                state.activeModal = "edit-license";
                triggerAppRender();
            }
            return;
        }

        // Delete License
        if (target.classList.contains("btn-delete-license")) {
            e.stopPropagation();
            const licenseId = Number(target.dataset.licenseId);
            if (!confirm("Are you sure you want to delete this license?")) return;

            const result = await LicenseApi.deleteLicense(licenseId);
            if (result.ok) {
                if (state.selectedLicenseId === licenseId) {
                    state.selectedLicenseId = null;
                    state.licenseDetails = { status: "not_selected" };
                }
                await refreshLicensesListData();
            } else {
                alert(`Failed to delete license: ${result.error.message}`);
            }
            return;
        }

        // Row Selection Tracker
        const clickableRow = target.closest("#table-licenses-list .clickable-row");
        if (clickableRow && !target.closest("button") && !target.classList.contains("btn")) {
            const licenseId = Number((clickableRow as HTMLElement).dataset.licenseId);

            if (state.selectedLicenseId === licenseId) {
                state.selectedLicenseId = null;
                state.licenseDetails = { status: "not_selected" };
            } else {
                state.selectedLicenseId = licenseId;
                state.licenseDetails = { status: "loading" };
                triggerAppRender();

                const result = await LicenseApi.getLicenseById(licenseId);
                if (state.selectedLicenseId === licenseId) {
                    if (result.ok) {
                        state.licenseDetails = { status: "success", item: result.data };
                    } else if (result.error.status === 404) {
                        state.licenseDetails = { status: "not_found" };
                    } else {
                        state.licenseDetails = { status: "error", message: result.error.message };
                    }
                }
            }
            triggerAppRender();
            return;
        }

        // Close Detail Panel Contexts
        if (target.id === "btn-close-license-details") {
            state.selectedLicenseId = null;
            state.licenseDetails = { status: "not_selected" };
            triggerAppRender();
            return;
        }

        // Dismiss Create Modal Box
        if (target.id === "btn-cancel-create-license") {
            state.activeModal = null;
            resetLicenseCreateForm();
            triggerAppRender();
            return;
        }

        // Dismiss Edit Modal Box
        if (target.id === "btn-cancel-edit-license") {
            state.activeModal = null;
            resetLicenseEditForm();
            triggerAppRender();
            return;
        }

        // Pagination Navigation - Next
        if (target.id === "btn-license-next-page") {
            const currentQuery = state.licenses.query;
            const nextOffset = currentQuery.offset + currentQuery.limit;
            if (nextOffset < state.licenses.totalCount) {
                state.licenses.query.offset = nextOffset;
                refreshLicensesListData();
            }
            return;
        }

        // Pagination Navigation - Previous
        if (target.id === "btn-license-prev-page") {
            const currentQuery = state.licenses.query;
            const prevOffset = currentQuery.offset - currentQuery.limit;
            if (prevOffset >= 0) {
                state.licenses.query.offset = prevOffset;
                refreshLicensesListData();
            }
            return;
        }
    });

    // --- FORM INVENTORY TRANSACTION SUBMISSIONS ---
    rootContainer.addEventListener("submit", async (e) => {
        const target = e.target as HTMLFormElement;

        // Process Create Request Block
        if (target.id === "form-create-license") {
            e.preventDefault();

            // Gather input element records locally to protect state mutations
            const softwareIdInput = target.querySelector("[name='software_id']") as HTMLInputElement;
            const licenseKeyInput = target.querySelector("[name='license_key']") as HTMLInputElement;

            state.licenseCreateForm.fields = {
                software_id: softwareIdInput?.value || "",
                license_key: licenseKeyInput?.value || ""
            };

            state.licenseCreateForm.isSubmitting = true;
            state.licenseCreateForm.formError = null;
            state.licenseCreateForm.fieldErrors = {};
            triggerAppRender();

            const payload = {
                software_id: Number(state.licenseCreateForm.fields.software_id || 0),
                license_key: state.licenseCreateForm.fields.license_key || ""
            };

            const result = await LicenseApi.createLicense(payload);

            if (result.ok) {
                state.activeModal = null;
                resetLicenseCreateForm();
                await refreshLicensesListData();
            } else {
                state.licenseCreateForm.isSubmitting = false;
                if (result.error.kind === "http" && result.error.errors) {
                    state.licenseCreateForm.fieldErrors = result.error.errors;
                } else {
                    state.licenseCreateForm.formError = result.error.message;
                }
                triggerAppRender();
            }
        }

        // Process Edit Request Block
        if (target.id === "form-edit-license") {
            e.preventDefault();
            if (state.selectedLicenseId === null) return;

            const softwareIdInput = target.querySelector("[name='software_id']") as HTMLInputElement;
            const licenseKeyInput = target.querySelector("[name='license_key']") as HTMLInputElement;

            state.licenseEditForm.fields = {
                software_id: softwareIdInput?.value || "",
                license_key: licenseKeyInput?.value || ""
            };

            state.licenseEditForm.isSubmitting = true;
            state.licenseEditForm.formError = null;
            state.licenseEditForm.fieldErrors = {};
            triggerAppRender();

            const payload = {
                id: state.selectedLicenseId,
                software_id: Number(state.licenseEditForm.fields.software_id || 0),
                license_key: state.licenseEditForm.fields.license_key || ""
            };

            const result = await LicenseApi.updateLicense(state.selectedLicenseId, payload);

            if (result.ok) {
                state.activeModal = null;
                resetLicenseEditForm();
                if (state.selectedLicenseId === result.data.id) {
                    state.licenseDetails = { status: "success", item: result.data };
                }
                await refreshLicensesListData();
            } else {
                state.licenseEditForm.isSubmitting = false;
                if (result.error.kind === "http" && result.error.errors) {
                    state.licenseEditForm.fieldErrors = result.error.errors;
                } else {
                    state.licenseEditForm.formError = result.error.message;
                }
                triggerAppRender();
            }
        }
    });
}