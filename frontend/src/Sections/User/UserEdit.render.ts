import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderUserEditForm(): string {
    const form = state.userEditForm;
    const fields = form.fields || {};

    const hasError = (field: string) => form.fieldErrors[field] ? "input-invalid" : "";
    const renderError = (field: string) => form.fieldErrors[field] ? `<span class=\"field-error-text\">${(form.fieldErrors[field][0])}</span>` : "";

    return `
        <div class="modal-backdrop">
            <div class="modal-form-content">
                <h3>Modify User Account Specifications (ID: ${(String(state.selectedUserId))})</h3>
                
                ${form.formError ? `<div class="alert alert-danger">${(form.formError)}</div>` : ""}
                
                <form id="form-edit-user" novalidate>
                    <div class="form-group">
                        <label for="edit-user-name">Full Personnel Name</label>
                        <input type="text" id="edit-user-name" name="name" class="${hasError("name")}" value="${(fields.name || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("name")}
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-user-login">Login Handle/Username</label>
                        <input type="text" id="edit-user-login" name="login" class="${hasError("login")}" value="${(fields.login || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("login")}
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-user-password">Reset Account Password</label>
                        <input type="password" id="edit-user-password" name="password" class="${hasError("password")}" value="${(fields.password || "")}" ${form.isSubmitting ? "disabled" : ""}>
                        ${renderError("password")}
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn" id="btn-cancel-edit-user" ${form.isSubmitting ? "disabled" : ""}>Dismiss changes</button>
                        <button type="submit" class="btn btn-primary" ${form.isSubmitting ? "disabled" : ""}>
                            ${form.isSubmitting ? "Saving System Updates..." : "Commit Credentials"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}