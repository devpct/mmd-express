"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class MohammadExpress {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    use(middleware) {
        this.app.use(middleware);
    }
    get(path, handler) {
        this.app.get(path, handler);
    }
    post(path, handler) {
        this.app.post(path, handler);
    }
    put(path, handler) {
        this.app.put(path, handler);
    }
    delete(path, handler) {
        this.app.delete(path, handler);
    }
    listen(port, callback) {
        this.app.listen(port, callback);
    }
}
exports.default = MohammadExpress;
