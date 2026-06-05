import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

export function renderAuthHeader(): string {
    const auth = state.auth;

    return `
        <div class="auth-context-bar" style="background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div class="auth-info" style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 14px; color: #495057; font-weight: 500;">Авторизовано як:</span>
                <strong style="color: #212529; font-size: 15px;">${escapeHtml(auth.currentUser)}</strong> 
                <span class="role-badge" style="background: ${auth.currentRole === "admin" ? "#dc3545" : "#0d6efd"}; color: white; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${escapeHtml(auth.currentRole)}
                </span>
            </div>
            <div class="auth-switcher" style="display: flex; align-items: center; gap: 10px;">
                <label for="global-role-select" style="font-size: 13px; color: #6c757d; font-weight: 500; margin: 0;">Імітація зміни ролі:</label>
                <select id="global-role-select" class="form-control" style="padding: 6px 12px; border-radius: 6px; border: 1px solid #ced4da; font-size: 14px; background-color: #fff; cursor: pointer; min-width: 160px;">
                    <option value="admin" ${auth.currentRole === "admin" ? "selected" : ""}>Admin (Повний доступ)</option>
                    <option value="user" ${auth.currentRole === "user" ? "selected" : ""}>User (Перегляд)</option>
                </select>
            </div>
        </div>
    `;
}