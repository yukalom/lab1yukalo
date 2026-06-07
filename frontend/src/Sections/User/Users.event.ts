import * as UserApi from "../../Api/UserApi";
import { state, fillUserEditForm } from "../../state/state";

type RenderTriggerCallback = () => void;

function makeLogin(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "_") || `user_${Date.now()}`;
}

function setCurrentUser(id: number | null): void {
  state.selectedUserId = id;
  if (id) localStorage.setItem("currentDemoUserId", String(id));
  else localStorage.removeItem("currentDemoUserId");
  const found = state.users.items.find((user) => user.id === id);
  if (found) fillUserEditForm(found);
}

async function refreshUsersListData(triggerAppRender: RenderTriggerCallback) {
  state.users.status = "loading";
  triggerAppRender();
  const result = await UserApi.getUsers({
    limit: state.users.query.limit,
    offset: state.users.query.offset,
    q: state.users.query.q || null,
    sortBy: state.users.query.sortBy,
    sortDir: state.users.query.sortDir,
  });
  if (!result.ok) {
    state.users = { ...state.users, status: "error", message: result.error.message, items: [] };
  } else {
    state.users = {
      status: result.data.items.length === 0 ? "empty" : "success",
      items: result.data.items,
      query: state.users.query,
      totalCount: result.data.page.count,
    };
    const savedId = Number(localStorage.getItem("currentDemoUserId"));
    const nextUser = result.data.items.find((u) => u.id === state.selectedUserId)
      ?? result.data.items.find((u) => u.id === savedId)
      ?? result.data.items[0]
      ?? null;
    setCurrentUser(nextUser?.id ?? null);
  }
  triggerAppRender();
}

export function attachUserEventListeners(rootContainer: HTMLElement, triggerAppRender: RenderTriggerCallback): void {
  rootContainer.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    if (target.id === "inline-user-name") {
      state.userEditForm.fields.name = target.value;
    }
  });

  rootContainer.addEventListener("change", async (e) => {
    const target = e.target as HTMLSelectElement;
    if (target.id === "current-user-select") {
      const userId = Number(target.value);
      const result = await UserApi.getUserById(userId);
      if (result.ok) setCurrentUser(result.data.id);
      triggerAppRender();
    }
  });

  rootContainer.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (target.id === "btn-inline-create-user") {
      const name = (document.getElementById("inline-user-name") as HTMLInputElement | null)?.value.trim() || "Новий користувач";
      const dto = { name, login: makeLogin(name), password: "demo" };
      const result = await UserApi.createUser(dto);
      if (!result.ok) { alert(result.error.message); return; }
      await refreshUsersListData(triggerAppRender);
      setCurrentUser(result.data.id);
      triggerAppRender();
      return;
    }
    if (target.id === "btn-inline-delete-user") {
      if (!state.selectedUserId) return;
      if (!confirm("Видалити поточний профіль?")) return;
      const result = await UserApi.deleteUser(state.selectedUserId);
      if (!result.ok) { alert(result.error.message); return; }
      setCurrentUser(null);
      await refreshUsersListData(triggerAppRender);
      return;
    }
  });

  rootContainer.addEventListener("submit", async (e) => {
    const form = e.target as HTMLFormElement;
    if (form.id !== "inline-user-form") return;
    e.preventDefault();
    if (!state.selectedUserId) return;
    const name = (document.getElementById("inline-user-name") as HTMLInputElement | null)?.value.trim();
    if (!name) { alert("Введіть ім’я користувача"); return; }
    const current = state.users.items.find((user) => user.id === state.selectedUserId);
    const dto = { id: state.selectedUserId, name, login: current?.login || makeLogin(name), password: current?.password || "demo" };
    const result = await UserApi.updateUser(state.selectedUserId, dto);
    if (!result.ok) { alert(result.error.message); return; }
    await refreshUsersListData(triggerAppRender);
  });
}
