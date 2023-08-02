"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
class Middleware {
    static logRequest(req, res, next) {
        console.log(`Received ${req.method} request at ${req.url}`);
        next();
    }
}
exports.Middleware = Middleware;
