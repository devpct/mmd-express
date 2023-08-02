"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.Router = void 0;
const request_1 = require("./request");
const response_1 = require("./response");
const middleware_1 = require("./middleware/middleware");
const path = require("path");
const fs = require("fs");
const http = require("node:http");
class Router {
    constructor() {
        this.routes = {
            'GET': {},
            'POST': {},
            'PUT': {},
            'DELETE': {},
        };
        this.middlewares = [];
        this._server = http.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = new response_1.Response(res);
            const request = new request_1.Request(req);
            yield request.readRequestBody();
        }));
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    get(path, callback) {
        this.routes['GET'][path] = callback;
    }
    post(path, callback) {
        this.routes['POST'][path] = callback;
    }
    handleRequest(req, res) {
        const request = new request_1.Request(req);
        const response = new response_1.Response(res);
        // Execute middleware stack before handling the request
        let currentMiddlewareIndex = 0;
        const runMiddleware = () => {
            if (currentMiddlewareIndex < this.middlewares.length) {
                const currentMiddleware = this.middlewares[currentMiddlewareIndex];
                currentMiddleware(request, response, () => {
                    currentMiddlewareIndex++;
                    runMiddleware();
                });
            }
            else {
                // All middleware functions have been executed, handle the request
                const method = req.method || 'GET';
                const url = req.url || '';
                const routeCallback = this.routes[method][url];
                if (routeCallback) {
                    routeCallback(request, response);
                }
                else {
                    // Handle 404 Not Found
                    response.status(404).send('Not Found');
                }
            }
        };
        runMiddleware();
    }
    listen(port, callback) {
        const http = require('http');
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(port, callback);
    }
    staticFile(folderPath) {
        this.get('/static/', (req, res) => {
            const fileName = req.params['file'];
            fs.readFile(path.join(folderPath, fileName), (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                res.send(data.toString());
            });
        });
    }
}
exports.Router = Router;
const router = () => {
    return new Router();
};
exports.router = router;
const app = (0, exports.router)();
app.use((req, res, next) => {
    // Middleware example
    console.log('Middleware is running!');
    next();
});
app.use(middleware_1.Middleware.logRequest);
app.get('/', (req, res) => {
    res.send('Hello from mmdexpress!');
});
// Static file serving
function staticFile(folderPath, req, res) {
    const fileName = req.params['file'];
    fs.readFile(path.join(folderPath, fileName), (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        res.send(data.toString());
    });
}
const publicFolder = path.join(__dirname, 'public');
app.get('/static/:file', staticFile.bind(null, publicFolder));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
