// src/Sections/Requests/RequestEdit.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderRequestEditForm(): string {
    const form = state.requestEditForm;
    const fields = form.fields || {};

    const hasError = (field: string) => form.fieldErrors[field] ? "input-invalid" : "";
    const renderError = (field: string) => form.fieldErrors[field] ? `<span class="field-error-text">${(form.fieldErrors[field][0])}</span>` : "";

    return `
        <div class="modal-backdrop">
            <div class="modal-form-content">
                <h3>Modify Request Parameters (ID: ${(String(state.selectedRequestId))})</h3>
                
                ${form.formError ? `<div class="alert alert-danger">${(form.formError)}</div>` : ""}
                
                <form id="form-edit-request" novalidate>
                    <div class="form-group">
                        <label for="edit-req-software-id">Software Product System ID</label>
                        <input type="number" id="edit-req-software-id" name="software_id" class="form-control ${hasError("software_id")}" value="${(fields.software_id || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("software_id")}
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-req-user-id">Requestor User Entity ID</label>
                        <input type="number" id="edit-req-user-id" name="user_id" class="form-control ${hasError("user_id")}" value="${(fields.user_id || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("user_id")}
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-req-date">Request Verification Date</label>
                        <input type="date" id="edit-req-date" name="request_date" class="form-control ${hasError("request_date")}" value="${(fields.request_date || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("request_date")}
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn" id="btn-cancel-edit-request" ${form.isSubmitting ? "disabled" : ""}>Dismiss Changes</button>
                        <button type="submit" class="btn btn-primary" ${form.isSubmitting ? "disabled" : ""}>
                            ${form.isSubmitting ? "Applying Alterations..." : "Commit Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}