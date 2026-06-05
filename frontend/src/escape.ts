export function escapeHtml(unsafeString: unknown): string {
    if (unsafeString === undefined || unsafeString === null) return "";
    const str = String(unsafeString);
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}