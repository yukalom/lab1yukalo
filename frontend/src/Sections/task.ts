import { taskDto } from "../../../common/types";

export function renderReports(data: taskDto[], onFilter: (license: string) => void): string {
    return `
        <div class="reports-section">
            <h3>Top Users by License Requests</h3>
            <div class="filter-controls">
                <input type="text" id="license-filter" placeholder="Enter license type..." />
                <button onclick="window.filterReports()">Filter</button>
            </div>
            <table>
                <thead>
                    <tr><th>User Name</th><th>Request Count</th></tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.request_count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}