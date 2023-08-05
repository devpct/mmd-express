"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
class middleware {
    static logRequest(req, res, next) {
        console.log(`Received ${req.method} request at ${req.url}`);
        next();
    }
}
exports.middleware = middleware;
