// src/Sections/SoftwareProducts/ProductDetails.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderProductDetails(): string {
    const details = state.productDetails;

    if (details.status === "not_selected") {
        return `<div class="details-placeholder">Select a software row from the list to view detailed analytical history parameters.</div>`;
    }
    if (details.status === "loading") {
        return `<div class="status-msg">Fetching full item breakdown profiles...</div>`;
    }
    if (details.status === "not_found") {
        return `<div class="status-msg error-msg">The selected item profile was not found on the asset registry server.</div>`;
    }
    if (details.status === "error") {
        return `<div class="status-msg error-msg">Error fetching specifications: ${escapeHtml(details.message)}</div>`;
    }

    const item = details.item;

    return `
        <div class="details-card">
            <div class="details-card-header">
                <h3>Component Specifications</h3>
                <button class="btn btn-close" id="btn-close-product-details">×</button>
            </div>
            <ul class="details-list">
                <li><strong>System Entity ID:</strong> ${(String(item.id))}</li>
                <li><strong>Product Unique Name:</strong> ${escapeHtml(item.name)}</li>
                <li><strong>Engineering Build Version:</strong> v${(String(item.version))}</li>
                <li><strong>Assigned Compliance Type:</strong> ${escapeHtml(item.licensetype)}</li>
                <li><strong>Initial Database Provision Date:</strong> ${escapeHtml(item.date)}</li>
            </ul>
        </div>
    `;
}