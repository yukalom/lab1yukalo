// src/Sections/Requests/RequestList.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderRequestsList(): string {
    const requestsState = state.requests;
    const query = requestsState.query;

    const getSortIcon = (field: string) => {
        if (query.sortBy !== field) return "";
        return query.sortDir === "asc" ? " ▲" : " ▼";
    };

    let tableContentHtml = "";

    if (requestsState.status === "loading") {
        tableContentHtml = `<tr><td colspan="5" class="status-msg">Loading operations registry logs...</td></tr>`;
    } else if (requestsState.status === "error") {
        tableContentHtml = `<tr><td colspan="5" class="status-msg error-msg">Error: ${(requestsState.message || "")}</td></tr>`;
    } else if (requestsState.status === "empty" || !requestsState.items.length) {
        tableContentHtml = `<tr><td colspan="5" class="status-msg">No access log entries correspond to the criteria.</td></tr>`;
    } else {
        tableContentHtml = requestsState.items
            .map((item) => {
                const isSelected = state.selectedRequestId === item.id;
                return `
                    <tr class="clickable-row ${isSelected ? "selected-row" : ""}" data-request-id="${item.id}" style="cursor: pointer;">
                        <td>${(String(item.id))}</td>
                        <td>${(String(item.software_id))}</td>
                        <td>${(String(item.user_id))}</td>
                        <td>${(item.request_date)}</td>
                        <td style="text-align: center;">
                            <div class="action-buttons-cell" style="display: flex; gap: 5px; justify-content: center;">
                                <button class="btn btn-sm btn-secondary btn-edit-request" data-request-id="${item.id}">Edit</button>
                                <button class="btn btn-sm btn-danger btn-delete-request" data-request-id="${item.id}">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            })
            .join("");
    }

    const currentItemsLength = requestsState.items.length;
    const totalCount = requestsState.totalCount || 0;
    const currentPage = Math.floor(query.offset / query.limit) + 1;
    const totalPages = Math.max(1, Math.ceil(totalCount / query.limit));

    const isPrevDisabled = query.offset === 0 || requestsState.status === "loading";
    const isNextDisabled = (query.offset + query.limit) >= totalCount || requestsState.status === "loading";

    return `
        <div class="section-controls" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <button class="btn btn-primary" id="btn-trigger-create-request">Add New Request</button>
        </div>

        <table class="data-table" id="table-requests-list" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="cursor: pointer;" data-sort-field="id">ID${getSortIcon("id")}</th>
                    <th style="cursor: pointer;" data-sort-field="software_id">Software ID${getSortIcon("software_id")}</th>
                    <th style="cursor: pointer;" data-sort-field="user_id">User ID${getSortIcon("user_id")}</th>
                    <th style="cursor: pointer;" data-sort-field="request_date">Request Date${getSortIcon("request_date")}</th>
                    <th style="text-align: center; width: 150px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tableContentHtml}
            </tbody>
        </table>
    `;
}