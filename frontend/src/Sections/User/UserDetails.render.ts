import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderUserDetails(): string {
    const details = state.userDetails;

    if (!details || details.status === "not_selected") {
        return `<div class="details-placeholder">Select a user profile from the list to analyze individual system credentials.</div>`;
    }
    if (details.status === "loading") {
        return `<div class="status-msg">Fetching account security profiles...</div>`;
    }
    if (details.status === "not_found") {
        return `<div class="status-msg error-msg">The specified user profile does not exist in the security registry.</div>`;
    }
    if (details.status === "error") {
        return `<div class="status-msg error-msg">Error loading user metadata: ${(details.message)}</div>`;
    }

    const item = details.item;

    return `
        <div class="details-card">
            <div class="details-card-header">
                <h3>User Information Profile</h3>
                <button class="btn btn-close" id="btn-close-user-details">×</button>
            </div>
            <ul class="details-list">
                <li><strong>System Record ID:</strong> ${(String(item.id))}</li>
                <li><strong>Full Display Name:</strong> ${(item.name)}</li>
                <li><strong>Login Handle/Username:</strong> <code>${(item.login)}</code></li>
                <li><strong>Stored Password Hash:</strong> <code>${(item.password)}</code></li>
            </ul>
        </div>
    `;
}