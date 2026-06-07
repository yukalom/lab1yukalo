import { state } from "../../state/state";
import { escapeHtml } from "../../escape";

function currentUser() {
  return state.users.items.find((user) => user.id === state.selectedUserId) ?? state.users.items[0] ?? null;
}

export function renderUsersList(): string {
  const usersState = state.users;
  const selected = currentUser();
  const nameValue = state.userEditForm.fields.name || selected?.name || "";

  if (!usersState || usersState.status === "loading") {
    return `<div class="status-msg">Loading user profiles...</div>`;
  }
  if (usersState.status === "error") {
    return `<div class="status-msg error-msg">Error: ${escapeHtml(usersState.message || "")}</div>`;
  }

  const options = usersState.items.map((user) => `
    <option value="${user.id}" ${user.id === selected?.id ? "selected" : ""}>${escapeHtml(user.name)}</option>
  `).join("");

  return `
    <div class="user-profile-form">
      <h3>Поточний профіль</h3>
      <div class="form-group">
        <select id="current-user-select" ${usersState.items.length === 0 ? "disabled" : ""}>
          ${options || `<option value="">Немає користувачів</option>`}
        </select>
      </div>
      <form id="inline-user-form" novalidate>
        <div class="form-group user-name-row">
          <div class="user-name-field">
            <label for="inline-user-name">Ім’я користувача</label>
            <input type="text" id="inline-user-name" name="name" value="${escapeHtml(nameValue)}" placeholder="Ім’я користувача">
          </div>
          <button type="button" class="btn btn-primary" id="btn-inline-create-user">Додати користувача</button>
          <button type="submit" class="btn btn-primary" id="btn-inline-update-user" ${!selected ? "disabled" : ""}>Змінити ім’я</button>
          <button type="button" class="btn btn-danger" id="btn-inline-delete-user" ${!selected ? "disabled" : ""}>Видалити</button>
        </div>
      </form>
      <p class="profile-note">Кожен профіль бачить і змінює тільки свої події.</p>
    </div>
  `;
}
