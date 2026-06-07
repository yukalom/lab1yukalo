// src/Sections/Licenses/LicenseDetails.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderLicenseDetails(): string {
    const details = state.licenseDetails;

    if (details.status === "not_selected") {
        return `<div class="details-placeholder">Select a cryptographic row entry from the register list to inspect properties.</div>`;
    }
    if (details.status === "loading") {
        return `<div class="status-msg">Fetching asset licensing parameters assignment structures...</div>`;
    }
    if (details.status === "not_found") {
        return `<div class="status-msg error-msg">The chosen key signature dataset was missing on the server registry nodes.</div>`;
    }
    if (details.status === "error") {
        return `<div class="status-msg error-msg">Error: ${escapeHtml(details.message)}</div>`;
    }

    const item = details.item;

    return `
        <div class="details-card">
            <div class="details-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3>License Verification Specs</h3>
                <button class="btn btn-close" id="btn-close-license-details" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
            <ul class="details-list" style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 8px;"><strong>Internal System Record ID:</strong> ${(String(item.id))}</li>
                <li style="margin-bottom: 8px;"><strong>Relational Target Software ID:</strong> ${(String(item.software_id))}</li>
                <li style="margin-bottom: 8px; word-break: break-all;">
                    <strong>Cryptographic Token Value:</strong> <br>
                    <code style="background: #f4f4f4; padding: 2px 4px; border-radius: 4px; display: inline-block; margin-top: 4px;">${escapeHtml(item.license_key)}</code>
                </li>
            </ul>
        </div>
    `;
}