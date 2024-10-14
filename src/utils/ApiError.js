class ApiError extends Error {
    constructor(
        statusCode,
        message,
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null; // Keep data as null or any other value
        this.message = message; // Set message as its own property
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            data: this.data,
            message: this.message,
            success: this.success,
            errors: this.errors
        };
    }
}
export {ApiError}