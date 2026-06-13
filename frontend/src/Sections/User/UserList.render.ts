import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderUsersList(): string {
    const usersState = state.users;
    const query = usersState.query;

    const getSortIcon = (field: string) => {
        if (query.sortBy !== field) return "";
        return query.sortDir === "asc" ? " ▲" : " ▼";
    };

    let tableContentHtml = "";

    if (usersState.status === "loading") {
        tableContentHtml = `<tr><td colspan="4" class="status-msg">Loading user database...</td></tr>`;
    } else if (usersState.status === "error") {
        tableContentHtml = `<tr><td colspan="4" class="status-msg error-msg">Error: ${escapeHtml(usersState.message || "")}</td></tr>`;
    } else if (usersState.status === "empty" || !usersState.items.length) {
        tableContentHtml = `<tr><td colspan="4" class="status-msg">No user records found matching the search criteria.</td></tr>`;
    } else {
        tableContentHtml = usersState.items.map((item) => {
            const isSelected = state.selectedUserId === item.id;
            return `
                <tr class="clickable-row ${isSelected ? "selected-row" : ""}" data-user-id="${item.id}">
                    <td>${item.id}</td>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${escapeHtml(item.login)}</td>
                    <td>
                        <div class="action-buttons-cell" style="display: flex; gap: 5px;">
                            <button class="btn btn-sm btn-edit-user" data-user-id="${item.id}">Edit</button>
                            <button class="btn btn-sm btn-danger btn-delete-user" data-user-id="${item.id}">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    const currentItemsLength = usersState.items.length;
    const totalCount = usersState.totalCount || 0;
    const currentPage = Math.floor(query.offset / query.limit) + 1;
    const totalPages = Math.max(1, Math.ceil(totalCount / query.limit));
    const isPrevDisabled = query.offset === 0 || usersState.status === "loading";
    const isNextDisabled = (query.offset + query.limit) >= totalCount || usersState.status === "loading";

    return `
        <div class="section-controls" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div class="search-box">
                <input type="text" id="input-search-users" class="form-control" placeholder="Search users by name or login..." value="${escapeHtml(query.q || "")}">
            </div>
            <button class="btn btn-primary" id="btn-trigger-create-user">Add New User</button>
        </div>

        <table class="data-table" id="table-users-list">
            <thead>
                <tr>
                    <th style="cursor: pointer;" data-sort-field="id">User ID${getSortIcon("id")}</th>
                    <th style="cursor: pointer;" data-sort-field="name">Full Name${getSortIcon("name")}</th>
                    <th style="cursor: pointer;" data-sort-field="login">Login Username${getSortIcon("login")}</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${tableContentHtml}</tbody>
        </table>

        <div class="pagination-container" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #ddd;">
            <span class="pagination-info">Showing records ${currentItemsLength ? query.offset + 1 : 0} - ${Math.min(query.offset + currentItemsLength, totalCount)} of ${totalCount}</span>
            <div class="pagination-actions" style="display: flex; gap: 10px;">
                <button class="btn btn-sm" id="btn-user-prev-page" ${isPrevDisabled ? "disabled" : ""}>Previous</button>
                <span style="align-self: center; font-weight: bold;">Page ${currentPage} / ${totalPages}</span>
                <button class="btn btn-sm" id="btn-user-next-page" ${isNextDisabled ? "disabled" : ""}>Next</button>
            </div>
        </div>
    `;
}
