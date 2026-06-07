// src/Sections/SoftwareProducts/ProductList.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

// src/Sections/SoftwareProducts/ProductList.render.ts

export function renderProductsList(): string {
    const productsState = state.products;

    // Defensive Fallback: If query doesn't exist on state yet, map standard defaults
    const query = ("query" in productsState && productsState.query)
        ? productsState.query
        : { limit: 20, offset: 0, q: "", sortBy: "id", sortDir: "desc" as const };

    // Build reusable sort-indicator helper for columns safely using our resolved query
    const getSortIcon = (field: string) => {
        if (query.sortBy !== field) return "";
        return query.sortDir === "asc" ? " ▲" : " ▼";
    };

    let tableContentHtml = "";

    if (productsState.status === "loading") {
        tableContentHtml = `<tr><td colspan=\"6\" class=\"status-msg\">Loading software database inventory...</td></tr>`;
    } else if (productsState.status === "error") {
        tableContentHtml = `<tr><td colspan=\"6\" class=\"status-msg error-msg\">Error: ${productsState.message || ""}</td></tr>`;
    } else if (productsState.status === "empty" || !("items" in productsState) || !productsState.items.length) {
        tableContentHtml = `<tr><td colspan=\"6\" class=\"status-msg\">No products matches found in the registry.</td></tr>`;
    } else {
        tableContentHtml = productsState.items
            .map((item) => {
                const isSelected = state.selectedProductId === item.id;
                return `
                    <tr class="clickable-row ${isSelected ? "selected-row" : ""}" data-product-id="${item.id}">
                        <td>${(item.id)}</td>
                        <td>${escapeHtml(item.name)}</td>
                        <td>v${(item.version)}</td>
                        <td><span class="badge badge-${item.licensetype.toLowerCase()}">${escapeHtml(item.licensetype)}</span></td>
                        <td>${escapeHtml(item.date)}</td>
                        <td>
                            <button class="btn btn-sm btn-edit-product" data-product-id="${item.id}">Edit</button>
                            <button class="btn btn-sm btn-danger btn-delete-product" data-product-id="${item.id}">Delete</button>
                        </td>
                    </tr>
                `;
            })
            .join("");
    }

    // Capture count metadata from state properties safely
    const totalCount = ("totalCount" in productsState) ? (productsState.totalCount ?? 0) : 0;
    const currentItemsLength = ("items" in productsState) ? productsState.items.length : 0;

    // Calculate pagination dynamics mapping fallback variables
    const currentPage = Math.floor(query.offset / query.limit) + 1;
    const totalPages = Math.ceil(totalCount / query.limit) || 1;

    const isPrevDisabled = query.offset === 0;
    const isNextDisabled = currentPage >= totalPages;

    return `
        <div class="section-header">
            <h2>Software Inventory</h2>
            <button class="btn btn-primary" id="btn-show-create-product">Add Product</button>
        </div>

        <div class="table-controls-bar" style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
            <input type="text" id="input-search-products" placeholder="Search products by name..." value="${escapeHtml(query.q || "")}" style="flex: 1; padding: 8px;" />
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th style="cursor: pointer;" data-sort-field="id">ID${getSortIcon("id")}</th>
                    <th style="cursor: pointer;" data-sort-field="name">Product Name${getSortIcon("name")}</th>
                    <th style="cursor: pointer;" data-sort-field="version">Version${getSortIcon("version")}</th>
                    <th style="cursor: pointer;" data-sort-field="licensetype">License Type${getSortIcon("licensetype")}</th>
                    <th style="cursor: pointer;" data-sort-field="date">Release Date${getSortIcon("date")}</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tableContentHtml}
            </tbody>
        </table>

        <div class="pagination-container" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #ddd;">
            <span class="pagination-info">
                Showing records ${currentItemsLength ? query.offset + 1 : 0} - ${Math.min(query.offset + query.limit, totalCount)} of ${totalCount}
            </span>
            <div class="pagination-actions" style="display: flex; gap: 10px;">
                <button class="btn btn-sm" id="btn-prev-page" ${isPrevDisabled ? "disabled" : ""}>Previous</button>
                <span style="align-self: center; font-weight: bold;">Page ${currentPage} / ${totalPages}</span>
                <button class="btn btn-sm" id="btn-next-page" ${isNextDisabled ? "disabled" : ""}>Next</button>
            </div>
        </div>
    `;
}