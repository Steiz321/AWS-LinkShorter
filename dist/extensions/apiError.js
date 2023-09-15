"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
    static NotFound(message) {
        return new ApiError(404, message);
    }
    static Forbidden(message) {
        return new ApiError(403, message);
    }
    static Unauthorized(message) {
        return new ApiError(401, message);
    }
    static BadRequest(message) {
        return new ApiError(400, message);
    }
    static Conflict(message) {
        return new ApiError(409, message);
    }
}
exports.ApiError = ApiError;
