export class AppError extends Error {
    status;
    code;
    constructor(status, code, message) {
        super(message);
        this.name = "AppError";
        this.status = status;
        this.code = code;
    }
}
//# sourceMappingURL=AppError.js.map