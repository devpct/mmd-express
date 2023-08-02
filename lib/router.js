"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const request_1 = require("./request");
const response_1 = require("./response");
const fs = require("fs");
const path = require("path");
class Router {
    constructor() {
        this.routes = {
            'GET': {},
            'POST': {},
            'PUT': {},
            'DELETE': {},
        };
        this.middlewares = [];
        // Implementation of the Router class
        // For example, we can initialize the middlewares here
        this.middlewares.push((req, res, next) => {
            console.log('Executing middleware 1');
            next();
        });
        this.middlewares.push((req, res, next) => {
            console.log('Executing middleware 2');
            next();
        });
    }
    use(middleware) {
        // Implementation of adding middleware
        this.middlewares.push(middleware);
    }
    get(path, callback) {
        // Implementation of defining a GET route
        this.routes['GET'][path] = callback;
    }
    post(path, callback) {
        // Implementation of defining a POST route
        this.routes['POST'][path] = callback;
    }
    handleRequest(req, res) {
        // Implementation of handling requests
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
        // Implementation of starting the server
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
