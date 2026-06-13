// src/app.ts

import { state } from "./state/state";
import * as SoftwareApi from "./Api/SoftwareApi";
import * as UserApi from "./Api/UserApi";
import * as LicenseApi from "./Api/LicenseApi";
import * as RequestApi from "./Api/RequestApi";

import { renderProductsList } from "./Sections/SoftwareProducts/ProductList.render";
import { renderProductDetails } from "./Sections/SoftwareProducts/ProductDetails.render";
import { renderProductCreateForm } from "./Sections/SoftwareProducts/ProductCreate.render";
import { renderProductEditForm } from "./Sections/SoftwareProducts/ProductEdit.render";
import { attachSoftwareEventListeners } from "./Sections/SoftwareProducts/Products.event";

import { renderUsersList } from "./Sections/User/UserList.render";
import { renderUserDetails } from "./Sections/User/UserDetails.render";
import { renderUserCreateForm } from "./Sections/User/UserCreate.render";
import { renderUserEditForm } from "./Sections/User/UserEdit.render";
import { attachUserEventListeners } from "./Sections/User/Users.event";

import { renderLicensesList } from "./Sections/Licenses/LicenseList.render";
import { renderLicenseDetails } from "./Sections/Licenses/LicenseDetails.render";
import { renderLicenseCreateForm } from "./Sections/Licenses/LicenseCreate.render";
import { renderLicenseEditForm } from "./Sections/Licenses/LicenseEdit.render";
import { attachLicenseEventListeners } from "./Sections/Licenses/Licenses.event";

import { renderRequestsList } from "./Sections/Requests/RequestList.render";
import { renderRequestDetails } from "./Sections/Requests/RequestDetails.render";
import { renderRequestCreateForm } from "./Sections/Requests/RequestCreate.render";
import { renderRequestEditForm } from "./Sections/Requests/RequestEdit.render";
import { attachRequestEventListeners } from "./Sections/Requests/Requests.event";

let currentActiveTab: "products" | "licenses" | "users" | "requests" = "products";

function render(): void {
    const viewContainer = document.getElementById("view-container");
    if (!viewContainer) {
        console.error("Target view element ID '#view-container' missing from DOM context node.");
        return;
    }

    document.querySelectorAll(".tab-btn").forEach((btn) => {
        const viewAttr = btn.getAttribute("data-view");
        if (viewAttr === currentActiveTab) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    let viewContentHtml = "";

    if (currentActiveTab === "products") {
        viewContentHtml = `
            <div class="workspace-layout">
                <div class="inventory-master-panel">
                    <div class="panel-header">
                        <h2>Products</h2>
                    </div>
                    <div class="filter-toolbar">
                    </div>
                    ${renderProductsList()}
                </div>
                <div class="inventory-details-panel">
                    ${renderProductDetails()}
                </div>
            </div>

            ${state.activeModal === "create-products" ? renderProductCreateForm() : ""}
            ${state.activeModal === "edit-products" ? renderProductEditForm() : ""}
        `;
    } else if (currentActiveTab === "users") {
        viewContentHtml = `
            <div class="workspace-layout">
                <div class="inventory-master-panel">
                    <div class="panel-header">
                        <h2>Users</h2>
                    </div>
                    <div class="filter-toolbar">
                    </div>
                    ${renderUsersList()}
                </div>
                <div class="inventory-details-panel">
                    ${renderUserDetails()}
                </div>
            </div>

            ${state.activeModal === "create-user" ? renderUserCreateForm() : ""}
            ${state.activeModal === "edit-user" ? renderUserEditForm() : ""}
        `;
    } else if (currentActiveTab === "licenses") {
        viewContentHtml = `
            <div class="workspace-layout">
                <div class="inventory-master-panel">
                    <div class="panel-header">
                        <h2>Licenses</h2>
                    </div>
                    <div class="filter-toolbar">
                    </div>
                    ${renderLicensesList()}
                </div>
                <div class="inventory-details-panel">
                    ${renderLicenseDetails()}
                </div>
            </div>

            ${state.activeModal === "create-license" ? renderLicenseCreateForm() : ""}
            ${state.activeModal === "edit-license" ? renderLicenseEditForm() : ""}
        `;
    } else if (currentActiveTab === "requests") {
        viewContentHtml = `
            <div class="workspace-layout">
                <div class="inventory-master-panel">
                    <div class="panel-header">
                        <h2>Requests</h2>
                    </div>
                    <div class="filter-toolbar">
                    </div>
                    ${renderRequestsList()}
                </div>
                <div class="inventory-details-panel">
                    ${renderRequestDetails()}
                </div>
            </div>

            ${state.activeModal === "create-request" ? renderRequestCreateForm() : ""}
            ${state.activeModal === "edit-request" ? renderRequestEditForm() : ""}
        `;
    }

    viewContainer.innerHTML = viewContentHtml;
}

(window as any).switchView = async function (tabName: "products" | "licenses" | "users" | "requests"): Promise<void> {
    currentActiveTab = tabName;
    state.activeModal = null; // Auto-close modals when switching sections

    if (tabName === "products") {
        state.products.status = "loading";
        render();

        const result = await SoftwareApi.getSoftware({
            limit: state.products.query.limit,
            offset: state.products.query.offset,
            q: state.products.query.q || null,
            sortBy: state.products.query.sortBy,
            sortDir: state.products.query.sortDir
        });

        if (result.ok) {
            state.products = {
                status: result.data.items.length === 0 ? "empty" : "success",
                items: result.data.items,
                query: state.products.query,
                totalCount: result.data.page.count
            };
        } else {
            state.products.status = "error";
            state.products.message = result.error.message;
        }
    }
    else if (tabName === "users") {
        state.users.status = "loading";
        render();

        const result = await UserApi.getUsers({
            limit: state.users.query.limit,
            offset: state.users.query.offset,
            q: state.users.query.q || null,
            sortBy: state.users.query.sortBy,
            sortDir: state.users.query.sortDir
        });

        if (result.ok) {
            state.users = {
                status: result.data.items.length === 0 ? "empty" : "success",
                items: result.data.items,
                query: state.users.query,
                totalCount: result.data.page.count
            };
        } else {
            state.users.status = "error";
            state.users.message = result.error.message;
        }
    }
    else if (tabName === "licenses") {
        state.licenses.status = "loading";
        render();

        const result = await LicenseApi.getLicenses({
            limit: state.licenses.query.limit,
            offset: state.licenses.query.offset,
            q: state.licenses.query.q || null,
            sortBy: state.licenses.query.sortBy,
            sortDir: state.licenses.query.sortDir
        });

        if (result.ok) {
            state.licenses = {
                status: result.data.items.length === 0 ? "empty" : "success",
                items: result.data.items,
                query: state.licenses.query,
                totalCount: result.data.page.count
            };
        } else {
            state.licenses.status = "error";
            state.licenses.message = result.error.message;
        }
    }
    else if (tabName === "requests") {
        state.requests.status = "loading";
        render();

        const result = await RequestApi.getRequests({
            limit: state.requests.query.limit,
            offset: state.requests.query.offset,
            q: state.requests.query.q || null,
            sortBy: state.requests.query.sortBy,
            sortDir: state.requests.query.sortDir
        });

        if (result.ok) {
            state.requests = {
                status: result.data.items.length === 0 ? "empty" : "success",
                items: result.data.items,
                query: state.requests.query,
                totalCount: result.data.page.count
            };
        } else {
            state.requests.status = "error";
            state.requests.message = result.error.message;
        }
    }

    render();
};

export async function startApp(): Promise<void> {
    attachSoftwareEventListeners(document.body, render);
    attachUserEventListeners(document.body, render);
    attachLicenseEventListeners(document.body, render);
    attachRequestEventListeners(document.body, render);

    state.products.status = "loading";
    state.productDetails = { status: "not_selected" };
    render();

    const result = await SoftwareApi.getSoftware({
        limit: state.products.query.limit,
        offset: state.products.query.offset,
        q: state.products.query.q || null,
        sortBy: state.products.query.sortBy,
        sortDir: state.products.query.sortDir
    });

    if (result.ok) {
        state.products = {
            status: result.data.items.length === 0 ? "empty" : "success",
            items: result.data.items,
            query: state.products.query,
            totalCount: result.data.page.count
        };
    } else {
        state.products.status = "error";
        state.products.message = result.error.message;
    }

    render();
}