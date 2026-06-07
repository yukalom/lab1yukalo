// src/Sections/Licenses/LicenseList.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderLicensesList(): string {
    const licensesState = state.licenses;
    const query = licensesState.query;

    const getSortIcon = (field: string) => {
        if (query.sortBy !== field) return "";
        return query.sortDir === "asc" ? " ▲" : " ▼";
    };

    let tableContentHtml = "";

    if (licensesState.status === "loading") {
        tableContentHtml = `<tr><td colspan="4" class="status-msg">Synchronizing licenses authorization database...</td></tr>`;
    } else if (licensesState.status === "error") {
        tableContentHtml = `<tr><td colspan="4" class="status-msg error-msg">Error: ${licensesState.message || ""}</td></tr>`;
    } else if (licensesState.status === "empty" || !licensesState.items.length) {
        tableContentHtml = `<tr><td colspan="4" class="status-msg">No license keys correspond to the specified evaluation parameters.</td></tr>`;
    } else {
        tableContentHtml = licensesState.items
            .map((item) => {
                const isSelected = state.selectedLicenseId === item.id;
                return `
                    <tr class="clickable-row ${isSelected ? "selected-row" : ""}" data-license-id="${item.id}" style="cursor: pointer;">
                        <td>${String(item.id)}</td>
                        <td>${String(item.software_id)}</td>
                        <td style="font-family: monospace;">${escapeHtml(item.license_key)}</td>
                        <td style="text-align: center;">
                            <div class="action-buttons-cell" style="display: flex; gap: 5px; justify-content: center;">
                                <button class="btn btn-sm btn-secondary btn-edit-license" data-license-id="${item.id}">Edit</button>
                                <button class="btn btn-sm btn-danger btn-delete-license" data-license-id="${item.id}">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join("");
    }

    const currentItemsLength = licensesState.items.length;
    const totalCount = licensesState.totalCount || 0;
    const currentPage = Math.floor(query.offset / query.limit) + 1;
    const totalPages = Math.max(1, Math.ceil(totalCount / query.limit));

    const isPrevDisabled = query.offset === 0 || licensesState.status === "loading";
    const isNextDisabled = (query.offset + query.limit) >= totalCount || licensesState.status === "loading";

    return `
        <div class="section-controls" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div class="search-box">
                <input type="text" id="input-search-licenses" class="form-control" placeholder="Search licenses..." value="${(query.q || "")}">
            </div>
            <button class="btn btn-primary" id="btn-trigger-create-license">Add New License</button>
        </div>

        <table class="data-table" id="table-licenses-list" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="cursor: pointer;" data-sort-field="id">ID${getSortIcon("id")}</th>
                    <th style="cursor: pointer;" data-sort-field="software_id">Software Product ID${getSortIcon("software_id")}</th>
                    <th style="cursor: pointer;" data-sort-field="license_key">Cryptographic License Token Key${getSortIcon("license_key")}</th>
                    <th style="text-align: center; width: 150px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tableContentHtml}
            </tbody>
        </table>
    `;
}