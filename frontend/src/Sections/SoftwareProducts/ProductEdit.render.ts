// src/Sections/SoftwareProducts/ProductEdit.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderProductEditForm(): string {
    const form = state.productEditForm;
    const fields = form.fields || {};

    const hasError = (field: string) => form.fieldErrors[field] ? "input-invalid" : "";
    const renderError = (field: string) => form.fieldErrors[field] ? `<span class="field-error-text">${(form.fieldErrors[field][0])}</span>` : "";

    return `
        <div class="modal-backdrop">
            <div class="modal-form-content">
                <h3>Modify Software Specifications (ID: ${(String(state.selectedProductId))})</h3>
                
                ${form.formError ? `<div class="alert alert-danger">${escapeHtml(form.formError)}</div>` : ""}
                
                <form id="form-edit-product" novalidate>
                    <div class="form-group">
                        <label for="edit-product-name">Product Designation Label</label>
                        <input type="text" id="edit-product-name" name="name" class="${hasError("name")}" value="${escapeHtml(fields.name || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("name")}
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-product-version">Build Revision Identity Index</label>
                        <input type="number" id="edit-product-version" name="version" class="${hasError("version")}" value="${escapeHtml(fields.version || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("version")}
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-product-licensetype">Regulatory Option Type</label>
                        <select id="edit-product-licensetype" name="licensetype" class="${hasError("licensetype")}" ${form.isSubmitting ? "disabled" : ""}>
                            <option value="Free" ${fields.licensetype === "Free" ? "selected" : ""}>Free</option>
                            <option value="Commercial" ${fields.licensetype === "Commercial" ? "selected" : ""}>Commercial</option>
                            <option value="Academic" ${fields.licensetype === "Academic" ? "selected" : ""}>Academic</option>
                        </select>
                        ${renderError("licensetype")}
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-product-date">Registered Engineering Date</label>
                        <input type="date" id="edit-product-date" name="date" class="${hasError("date")}" value="${escapeHtml(fields.date || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("date")}
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn" id="btn-cancel-edit-product" ${form.isSubmitting ? "disabled" : ""}>Dismiss Changes</button>
                        <button type="submit" class="btn btn-primary" ${form.isSubmitting ? "disabled" : ""}>
                            ${form.isSubmitting ? "Processing Registry Modifications..." : "Commit Asset Overwrites"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}