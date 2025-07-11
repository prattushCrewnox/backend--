class ApiError extends Error {
    constructor(statusCode,
        message = "An error occurred",
        stack = "",
        errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.stack = stack;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
            this.stack = this.stack || new Error().stack;
        }
    }
}
export default ApiError;