// src/Sections/Licenses/LicenseEdit.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderLicenseEditForm(): string {
    const form = state.licenseEditForm;
    const fields = form.fields || {};

    const hasError = (field: string) => form.fieldErrors[field] ? "input-invalid" : "";
    const renderError = (field: string) => form.fieldErrors[field] ? `<span class="field-error-text">${(form.fieldErrors[field][0])}</span>` : "";

    return `
        <div class="modal-backdrop">
            <div class="modal-form-content">
                <h3>Modify License Configuration (ID: ${String(state.selectedLicenseId)})</h3>
                
                ${form.formError ? `<div class="alert alert-danger">${escapeHtml(form.formError)}</div>` : ""}
                
                <form id="form-edit-license" novalidate>
                    <div class="form-group">
                        <label for="edit-lic-software-id">Software Product System ID</label>
                        <input type="number" id="edit-lic-software-id" name="software_id" class="form-control ${hasError("software_id")}" value="${(fields.software_id || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("software_id")}
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-lic-key">Cryptographic License Token Key String</label>
                        <input type="text" id="edit-lic-key" name="license_key" class="form-control ${hasError("license_key")}" value="${escapeHtml(fields.license_key || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("license_key")}
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn" id="btn-cancel-edit-license" ${form.isSubmitting ? "disabled" : ""}>Dismiss Changes</button>
                        <button type="submit" class="btn btn-primary" ${form.isSubmitting ? "disabled" : ""}>
                            ${form.isSubmitting ? "Applying Re-allocations..." : "Commit Key Overwrites"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}