"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ErrorHandler.ts
class ErrorHandler extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorHandler;
