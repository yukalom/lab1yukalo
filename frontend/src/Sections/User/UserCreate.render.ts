import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderUserCreateForm(): string {
    const form = state.userCreateForm;
    const fields = form.fields || {};

    const hasError = (field: string) => form.fieldErrors[field] ? "input-invalid" : "";
    const renderError = (field: string) => form.fieldErrors[field] ? `<span class=\"field-error-text\">${(form.fieldErrors[field][0])}</span>` : "";

    return `
        <div class="modal-backdrop">
            <div class="modal-form-content">
                <h3>Provision New System User Account</h3>
                
                ${form.formError ? `<div class="alert alert-danger">${(form.formError)}</div>` : ""}
                
                <form id="form-create-user" novalidate>
                    <div class="form-group">
                        <label for="create-user-name">Full Personnel Name</label>
                        <input type="text" id="create-user-name" name="name" class="${hasError("name")}" value="${(fields.name || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("name")}
                    </div>
                    
                    <div class="form-group">
                        <label for="create-user-login">Unique Login Username</label>
                        <input type="text" id="create-user-login" name="login" class="${hasError("login")}" value="${(fields.login || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("login")}
                    </div>
                    
                    <div class="form-group">
                        <label for="create-user-password">Account Access Password</label>
                        <input type="password" id="create-user-password" name="password" class="${hasError("password")}" value="${(fields.password || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("password")}
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn" id="btn-cancel-create-user" ${form.isSubmitting ? "disabled" : ""}>Cancel</button>
                        <button type="submit" class="btn btn-primary" ${form.isSubmitting ? "disabled" : ""}>
                            ${form.isSubmitting ? "Creating Identity..." : "Save Identity Record"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}