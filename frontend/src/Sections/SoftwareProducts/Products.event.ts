// src/Sections/SoftwareProducts/Products.event.ts

import * as SoftwareApi from "../../Api/SoftwareApi";
import { state, fillProductEditForm, resetProductCreateForm, resetProductEditForm } from "../../state/state";

// Local type-casting overlay to access activeModal safely without altering state.ts

type RenderTriggerCallback = () => void;

let searchDebounceTimeout: ReturnType<typeof setTimeout> | null = null;

export function attachSoftwareEventListeners(rootContainer: HTMLElement, triggerAppRender: RenderTriggerCallback): void {

    async function refreshProductsListData() {
        state.products.status = "loading";
        triggerAppRender();

        const result = await SoftwareApi.getSoftware({
            limit: state.products.query.limit,
            offset: state.products.query.offset,
            q: state.products.query.q || null,
            sortBy: state.products.query.sortBy,
            sortDir: state.products.query.sortDir
        });

        if (!result.ok) {
            state.products = {
                ...state.products,
                status: "error",
                message: result.error.message,
                items: []
            };
        } else {
            state.products = {
                ...state.products,
                status: result.data.items.length === 0 ? "empty" : "success",
                items: result.data.items,
                totalCount: result.data.page.count
            };
        }
        triggerAppRender();
    }

    // --- DEBOUNCED SEARCH INPUT ---
    rootContainer.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        if (target.id !== "input-search-products") return;

        if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);

        searchDebounceTimeout = setTimeout(() => {
            state.products.query.q = target.value.trim();
            state.products.query.offset = 0;
            refreshProductsListData();
        }, 350);
    });

    // --- COLUMN SORTING ---
    rootContainer.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const header = target.closest("th[data-sort-field]") as HTMLElement | null;
        if (!header) return;

        const field = header.getAttribute("data-sort-field")!;
        const currentQuery = state.products.query;

        if (currentQuery.sortBy === field) {
            currentQuery.sortDir = currentQuery.sortDir === "asc" ? "desc" : "asc";
        } else {
            currentQuery.sortBy = field;
            currentQuery.sortDir = "asc";
        }

        currentQuery.offset = 0;
        refreshProductsListData();
    });

    // --- MAIN CLICK ROUTER ---
    rootContainer.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement;

        // Open Create Modal
        if (target.id === "btn-show-create-product") {
            state.activeModal = "create-products";
            resetProductCreateForm();
            triggerAppRender();
            return;
        }

        // Cancel Create Modal
        if (target.id === "btn-cancel-create-product") {
            state.activeModal = null;
            resetProductCreateForm();
            triggerAppRender();
            return;
        }

        // Cancel Edit Modal
        if (target.id === "btn-cancel-edit-product") {
            state.activeModal = null;
            resetProductEditForm();
            triggerAppRender();
            return;
        }

        // Close Detail Panel
        if (target.id === "btn-close-product-details") {
            state.selectedProductId = null;
            state.productDetails = { status: "not_selected" };
            triggerAppRender();
            return;
        }

        // Pagination - Previous
        if (target.id === "btn-prev-page") {
            const query = state.products.query;
            if (query.offset > 0) {
                query.offset = Math.max(0, query.offset - query.limit);
                refreshProductsListData();
            }
            return;
        }

        // Pagination - Next
        if (target.id === "btn-next-page") {
            const query = state.products.query;
            if (query.offset + query.limit < state.products.totalCount) {
                query.offset += query.limit;
                refreshProductsListData();
            }
            return;
        }

        // Open Edit Modal
        const editBtn = target.closest(".btn-edit-product") as HTMLButtonElement | null;
        if (editBtn) {
            e.stopPropagation();
            const productId = Number(editBtn.getAttribute("data-product-id"));
            const matchItem = state.products.items.find((item) => item.id === productId);
            if (matchItem) {
                state.selectedProductId = productId;
                state.activeModal = "edit-products";
                fillProductEditForm(matchItem);
                triggerAppRender();
            }
            return;
        }

        // Delete
        const deleteBtn = target.closest(".btn-delete-product") as HTMLButtonElement | null;
        if (deleteBtn) {
            e.stopPropagation();
            const productId = Number(deleteBtn.getAttribute("data-product-id"));
            if (!confirm(`Are you sure you want to delete product record #${productId}?`)) return;

            state.productDeleteState.isDeleting = true;
            state.productDeleteState.error = null;
            triggerAppRender();

            const result = await SoftwareApi.deleteSoftware(productId);
            state.productDeleteState.isDeleting = false;

            if (!result.ok) {
                state.productDeleteState.error = result.error.message;
                triggerAppRender();
            } else {
                if (state.selectedProductId === productId) {
                    state.selectedProductId = null;
                    state.productDetails = { status: "not_selected" };
                }
                refreshProductsListData();
            }
            return;
        }

        // Row Selection (must be last — broadest selector)
        const row = target.closest(".clickable-row") as HTMLTableRowElement | null;
        if (row) {
            const productId = Number(row.getAttribute("data-product-id"));

            if (state.selectedProductId === productId) {
                state.selectedProductId = null;
                state.productDetails = { status: "not_selected" };
                triggerAppRender();
            } else {
                state.selectedProductId = productId;
                state.productDetails = { status: "loading" };
                triggerAppRender();

                const result = await SoftwareApi.getSoftwareById(productId);
                if (state.selectedProductId === productId) {
                    if (!result.ok) {
                        state.productDetails = {
                            status: result.error.status === 404 ? "not_found" : "error",
                            message: result.error.message
                        };
                    } else {
                        state.productDetails = { status: "success", item: result.data };
                    }
                    triggerAppRender();
                }
            }
        }
    });

    // --- FORM: CREATE ---
    rootContainer.addEventListener("submit", async (e) => {
        const target = e.target as HTMLFormElement;
        if (target.id !== "form-create-product") return;
        e.preventDefault();

        const formData = new FormData(target);
        const name = formData.get("name") as string;
        const version = Number(formData.get("version"));
        const licensetype = formData.get("licensetype") as "Free" | "Commercial" | "Academic";
        const date = formData.get("date") as string;

        state.productCreateForm.isSubmitting = true;
        state.productCreateForm.fieldErrors = {};
        state.productCreateForm.formError = null;
        state.productCreateForm.fields = { name, version: String(version), licensetype, date };
        triggerAppRender();

        const result = await SoftwareApi.createSoftware({ name, version, licensetype, date });
        state.productCreateForm.isSubmitting = false;

        if (!result.ok) {
            if (result.error.errors) {
                state.productCreateForm.fieldErrors = result.error.errors;
            } else {
                state.productCreateForm.formError = result.error.message;
            }
            triggerAppRender();
        } else {
            state.activeModal = null;
            resetProductCreateForm();
            state.selectedProductId = result.data.id;
            state.productDetails = { status: "success", item: result.data };
            refreshProductsListData();
        }
    });

    // --- FORM: EDIT ---
    rootContainer.addEventListener("submit", async (e) => {
        const target = e.target as HTMLFormElement;
        if (target.id !== "form-edit-product") return;
        e.preventDefault();

        if (state.selectedProductId === null) return;

        const formData = new FormData(target);
        const name = formData.get("name") as string;
        const version = Number(formData.get("version"));
        const licensetype = formData.get("licensetype") as "Free" | "Commercial" | "Academic";
        const date = formData.get("date") as string;

        state.productEditForm.isSubmitting = true;
        state.productEditForm.fieldErrors = {};
        state.productEditForm.formError = null;
        state.productEditForm.fields = { name, version: String(version), licensetype, date };
        triggerAppRender();

        const result = await SoftwareApi.updateSoftware(state.selectedProductId, {
            id: state.selectedProductId,
            name,
            version,
            licensetype,
            date
        });
        state.productEditForm.isSubmitting = false;

        if (!result.ok) {
            if (result.error.errors) {
                state.productEditForm.fieldErrors = result.error.errors;
            } else {
                state.productEditForm.formError = result.error.message;
            }
            triggerAppRender();
        } else {
            state.activeModal = null;
            resetProductEditForm();
            state.productDetails = { status: "success", item: result.data };
            refreshProductsListData();
        }
    });
}