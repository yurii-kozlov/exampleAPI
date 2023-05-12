"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError {
    constructor(status, message, errors = []) {
        this.message = (message);
        this.status = status;
        this.errors = errors;
    }
    static UnathorizedError() {
        return new ApiError(401, 'The user is not authorized');
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}
exports.default = ApiError;
//# sourceMappingURL=api-error.js.map