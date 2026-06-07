// src/Sections/Requests/RequestDetails.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderRequestDetails(): string {
    const details = state.requestDetails;

    if (details.status === "not_selected") {
        return `<div class="details-placeholder">Select an operation ledger row to inspect deep historical criteria metrics.</div>`;
    }
    if (details.status === "loading") {
        return `<div class="status-msg">Fetching relational parameter payload specifications...</div>`;
    }
    if (details.status === "not_found") {
        return `<div class="status-msg error-msg">The tracked entry could not be synchronized or was removed.</div>`;
    }
    if (details.status === "error") {
        return `<div class="status-msg error-msg">Error: ${escapeHtml(details.message)}</div>`;
    }

    const item = details.item;

    return `
        <div class="details-card">
            <div class="details-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3>Ledger Audit Entry</h3>
                <button class="btn btn-close" id="btn-close-request-details" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
            <ul class="details-list" style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 8px;"><strong>Record System ID:</strong> ${(String(item.id))}</li>
                <li style="margin-bottom: 8px;"><strong>Target Asset ID:</strong> ${(String(item.software_id))}</li>
                <li style="margin-bottom: 8px;"><strong>Requestor User ID:</strong> ${(String(item.user_id))}</li>
                <li style="margin-bottom: 8px;"><strong>Timestamp Captured:</strong> ${escapeHtml(item.request_date)}</li>
            </ul>
        </div>
    `;
}