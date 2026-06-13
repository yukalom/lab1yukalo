import * as UserApi from "../../Api/UserApi";
import {
    state as originalState,
    fillUserEditForm,
    resetUserCreateForm,
    resetUserEditForm
} from "../../state/state";

const state = originalState as typeof originalState & { activeModal?: string | null };

type RenderTriggerCallback = () => void;
let searchDebounceTimeout: ReturnType<typeof setTimeout> | null = null;

export function attachUserEventListeners(rootContainer: HTMLElement, triggerAppRender: RenderTriggerCallback): void {
    async function refreshUsersListData() {
        state.users.status = "loading";
        triggerAppRender();

        const result = await UserApi.getUsers({
            limit: state.users.query.limit,
            offset: state.users.query.offset,
            q: state.users.query.q || null,
            sortBy: state.users.query.sortBy,
            sortDir: state.users.query.sortDir
        });

        if (!result.ok) {
            state.users = {
                ...state.users,
                status: "error",
                message: result.error.message,
                items: []
            };
        } else {
            state.users = {
                status: result.data.items.length === 0 ? "empty" : "success",
            items: result.data.items,
                query: state.users.query,
                totalCount: result.data.page.count
        };
        }
        triggerAppRender();
    }

    rootContainer.addEventListener("input", (e) => {
        const target = e.target as HTMLElement;
        if (target.id === "input-search-users") {
            const currentSearchValue = (target as HTMLInputElement).value;

            if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);

            searchDebounceTimeout = setTimeout(() => {
                state.users.query.q = currentSearchValue;
                state.users.query.offset = 0;
                refreshUsersListData();
            }, 350);
        }

        if (target.tagName === "INPUT" && (target as HTMLInputElement).form) {
            const formElement = (target as HTMLInputElement).form;

            if (formElement?.id === "form-create-user") {
                const nameAttr = target.getAttribute("name");
                if (nameAttr) {
                    state.userCreateForm.fields[nameAttr] = (target as HTMLInputElement).value;
                }
            }
            if (formElement?.id === "form-edit-user") {
                const nameAttr = target.getAttribute("name");
                if (nameAttr) {
                    state.userEditForm.fields[nameAttr] = (target as HTMLInputElement).value;
                }
            }
        }
    });

    rootContainer.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const sortHeader = target.closest("#table-users-list th[data-sort-field]");

        if (sortHeader) {
            const field = sortHeader.getAttribute("data-sort-field")!;
            const currentDir = state.users.query.sortDir;

            state.users.query.sortBy = field;
            state.users.query.sortDir = currentDir === "asc" ? "desc" : "asc";
            state.users.query.offset = 0;

            refreshUsersListData();
        }
    });

    rootContainer.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement;

        if (target.id === "btn-trigger-create-user") {
            resetUserCreateForm();
            state.activeModal = "create-user";
            triggerAppRender();
            return;
        }

        if (target.classList.contains("btn-edit-user")) {
            e.stopPropagation();
            const userId = Number(target.dataset.userId);
            state.selectedUserId = userId;

            const found = state.users.items.find(u => u.id === userId);
            if (found) {
                fillUserEditForm(found);
                state.activeModal = "edit-user";
                triggerAppRender();
            }
            return;
        }

        if (target.classList.contains("btn-delete-user")) {
            e.stopPropagation();
            const userId = Number(target.dataset.userId);
            if (!confirm("Are you sure you want to delete this user?")) return;

            const result = await UserApi.deleteUser(userId);
            if (result.ok) {
                if (state.selectedUserId === userId) {
                    state.selectedUserId = null;
                    state.userDetails = { status: "not_selected" };
                }
                await refreshUsersListData();
            } else {
                alert(`Failed to delete user: ${result.error.message}`);
            }
            return;
        }

        const clickableRow = target.closest("#table-users-list .clickable-row");
        if (clickableRow && !target.closest("button") && !target.classList.contains("btn")) {
            const userId = Number((clickableRow as HTMLElement).dataset.userId);

            if (state.selectedUserId === userId) {
                state.selectedUserId = null;
                state.userDetails = { status: "not_selected" };
            } else {
                state.selectedUserId = userId;
                state.userDetails = { status: "loading" };
                triggerAppRender();

                const result = await UserApi.getUserById(userId);
                if (state.selectedUserId === userId) { // Validate race conditions
                    if (result.ok) {
                        state.userDetails = { status: "success", item: result.data };
                    } else if (result.error.status === 404) {
                        state.userDetails = { status: "not_found" };
                    } else {
                        state.userDetails = { status: "error", message: result.error.message };
                    }
                }
            }
            triggerAppRender();
            return;
        }

        if (target.id === "btn-close-user-details") {
            state.selectedUserId = null;
            state.userDetails = { status: "not_selected" };
            triggerAppRender();
            return;
        }

        if (target.id === "btn-cancel-create-user") {
            state.activeModal = null;
            resetUserCreateForm();
            triggerAppRender();
            return;
        }

        if (target.id === "btn-cancel-edit-user") {
            state.activeModal = null;
            resetUserEditForm();
            triggerAppRender();
            return;
        }

        if (target.id === "btn-user-next-page") {
            const query = state.users.query;
            const nextOffset = query.offset + query.limit;
            if (nextOffset < state.users.totalCount) {
                state.users.query.offset = nextOffset;
                refreshUsersListData();
            }
            return;
        }

        if (target.id === "btn-user-prev-page") {
            const query = state.users.query;
            const prevOffset = query.offset - query.limit;
            if (prevOffset >= 0) {
                state.users.query.offset = prevOffset;
                refreshUsersListData();
            }
            return;
        }
        
    });

    rootContainer.addEventListener("submit", async (e) => {
        const target = e.target as HTMLFormElement;
        if (target.id !== "form-create-user") return;
        e.preventDefault();

        const formData = new FormData(target);
        const name = String(formData.get("name") ?? "").trim();
        const login = String(formData.get("login") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        state.userCreateForm.isSubmitting = true;
        state.userCreateForm.fieldErrors = {};
        state.userCreateForm.formError = null;
        state.userCreateForm.fields = { name, login, password };
        triggerAppRender();

        const result = await UserApi.createUser({ name, login, password });
        state.userCreateForm.isSubmitting = false;

        if (!result.ok) {
            if (result.error.errors) {
                state.userCreateForm.fieldErrors = result.error.errors;
            } else {
                state.userCreateForm.formError = result.error.message;
            }
            triggerAppRender();
            return;
        }

        state.activeModal = null;
        resetUserCreateForm();
        state.selectedUserId = result.data.id;
        state.userDetails = { status: "success", item: result.data };
        await refreshUsersListData();
    });

    rootContainer.addEventListener("submit", async (e) => {
        const target = e.target as HTMLFormElement;
        if (target.id !== "form-edit-user") return;
        e.preventDefault();

        if (state.selectedUserId === null) return;

        const formData = new FormData(target);
        const name = String(formData.get("name") ?? "").trim();
        const login = String(formData.get("login") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        state.userEditForm.isSubmitting = true;
        state.userEditForm.fieldErrors = {};
        state.userEditForm.formError = null;
        state.userEditForm.fields = { name, login, password };
        triggerAppRender();

        const result = await UserApi.updateUser(state.selectedUserId, {
            id: state.selectedUserId,
            name,
            login,
            password
        });
        state.userEditForm.isSubmitting = false;

        if (!result.ok) {
            if (result.error.errors) {
                state.userEditForm.fieldErrors = result.error.errors;
            } else {
                state.userEditForm.formError = result.error.message;
            }
            triggerAppRender();
            return;
        }

        state.activeModal = null;
        resetUserEditForm();
        state.userDetails = { status: "success", item: result.data };
        await refreshUsersListData();
    });

}
