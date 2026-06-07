// src/Sections/Requests/RequestCreate.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderRequestCreateForm(): string {
    const form = state.requestCreateForm;
    const fields = form.fields || {};

    const hasError = (field: string) => form.fieldErrors[field] ? "input-invalid" : "";
    const renderError = (field: string) => form.fieldErrors[field] ? `<span class="field-error-text">${(form.fieldErrors[field][0])}</span>` : "";

    return `
        <div class="modal-backdrop">
            <div class="modal-form-content">
                <h3>Log New Access Request</h3>
                
                ${form.formError ? `<div class="alert alert-danger">${escapeHtml(form.formError)}</div>` : ""}
                
                <form id="form-create-request" novalidate>
                    <div class="form-group">
                        <label for="create-req-software-id">Software Product System ID</label>
                        <input type="number" id="create-req-software-id" name="software_id" class="form-control ${hasError("software_id")}" value="${(fields.software_id || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("software_id")}
                    </div>
                    
                    <div class="form-group">
                        <label for="create-req-user-id">Requestor User Entity ID</label>
                        <input type="number" id="create-req-user-id" name="user_id" class="form-control ${hasError("user_id")}" value="${(fields.user_id || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("user_id")}
                    </div>
                    
                    <div class="form-group">
                        <label for="create-req-date">Request Verification Date</label>
                        <input type="date" id="create-req-date" name="request_date" class="form-control ${hasError("request_date")}" value="${escapeHtml(fields.request_date || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("request_date")}
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn" id="btn-cancel-create-request" ${form.isSubmitting ? "disabled" : ""}>Cancel</button>
                        <button type="submit" class="btn btn-primary" ${form.isSubmitting ? "disabled" : ""}>
                            ${form.isSubmitting ? "Saving Entry..." : "Save Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}