// src/Sections/SoftwareProducts/ProductCreate.render.ts

import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderProductCreateForm(): string {
    const form = state.productCreateForm;
    const fields = form.fields || {};

    const hasError = (field: string) => form.fieldErrors[field] ? "input-invalid" : "";
    const renderError = (field: string) => form.fieldErrors[field] ? `<span class="field-error-text">${(form.fieldErrors[field][0])}</span>` : "";

    return `
        <div class="modal-backdrop">
            <div class="modal-form-content">
                <h3>Register New Software Product</h3>
                
                ${form.formError ? `<div class="alert alert-danger">${(form.formError)}</div>` : ""}
                
                <form id="form-create-product" novalidate>
                    <div class="form-group">
                        <label for="create-product-name">Product Label (Unique)</label>
                        <input type="text" id="create-product-name" name="name" class="${hasError("name")}" value="${(fields.name || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("name")}
                    </div>
                    
                    <div class="form-group">
                        <label for="create-product-version">Engineering Build Version</label>
                        <input type="number" id="create-product-version" name="version" class="${hasError("version")}" value="${(fields.version || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("version")}
                    </div>
                    
                    <div class="form-group">
                        <label for="create-product-licensetype">Assigned License Category</label>
                        <select id="create-product-licensetype" name="licensetype" class="${hasError("licensetype")}" ${form.isSubmitting ? "disabled" : ""}>
                            <option value="Free" ${fields.licensetype === "Free" ? "selected" : ""}>Free</option>
                            <option value="Commercial" ${fields.licensetype === "Commercial" ? "selected" : ""}>Commercial</option>
                            <option value="Academic" ${fields.licensetype === "Academic" ? "selected" : ""}>Academic</option>
                        </select>
                        ${renderError("licensetype")}
                    </div>
                    
                    <div class="form-group">
                        <label for="create-product-date">Deployment Launch Release Date</label>
                        <input type="date" id="create-product-date" name="date" class="${hasError("date")}" value="${escapeHtml(fields.date || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("date")}
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn" id="btn-cancel-create-product" ${form.isSubmitting ? "disabled" : ""}>Cancel</button>
                        <button type="submit" class="btn btn-primary" ${form.isSubmitting ? "disabled" : ""}>
                            ${form.isSubmitting ? "Persisting Record..." : "Save Product Asset"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}