
export class ApiError extends Error {
    readonly status: number;

    static NotFound(message: string) {
        return new ApiError(404, message);
    }

    static Forbidden(message: string) {
        return new ApiError(403, message);
    }

    static Unauthorized(message: string) {
        return new ApiError(401, message);
    }

    static BadRequest(message: string) {
        return new ApiError(400, message);
    }

    static Conflict(message: string) {
        return new ApiError(409, message);
    }

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}