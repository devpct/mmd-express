"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
class HomeController {
    static index(req, res) {
        // Implementation of the home page controller
        res.send('Hello World');
    }
}
exports.HomeController = HomeController;
