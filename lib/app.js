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
exports.mmdExpress = exports.MmdExpress = void 0;
const http = require("node:http");
const request_1 = require("./request");
const response_1 = require("./response");
const path = require("path");
const fs = require("fs");
const urlPattern = require("url-pattern");
class MmdExpress {
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
            console.log('Received a request:', req.url);
            // await request.readRequestBody();
            this.handleRequest(req, res);
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
    put(path, callback) {
        this.routes['PUT'][path] = callback;
    }
    delete(path, callback) {
        this.routes['DELETE'][path] = callback;
    }
    handleRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new request_1.Request(req);
            const response = new response_1.Response(res);
            // Define the next function to be passed to middlewares
            const next = () => {
                currentMiddlewareIndex++;
                runMiddleware();
            };
            // Execute middleware stack before handling the request
            let currentMiddlewareIndex = 0;
            const runMiddleware = () => {
                var _a, _b;
                if (currentMiddlewareIndex < this.middlewares.length) {
                    const currentMiddleware = this.middlewares[currentMiddlewareIndex];
                    currentMiddleware(request, response, next);
                }
                else {
                    // All middleware functions have been executed, handle the request
                    const method = (_a = req.method) !== null && _a !== void 0 ? _a : 'GET';
                    const url = (_b = req.url) !== null && _b !== void 0 ? _b : '';
                    const routeCallback = this.findRouteCallback(method, url);
                    if (routeCallback) {
                        try {
                            routeCallback(request, response);
                        }
                        catch (error) {
                            response.status(500).json({ message: 'Internal server error' });
                            console.error('Error: ', error);
                        }
                    }
                    else {
                        // Handle 404 Not Found
                        response.status(404).send('Not Found');
                    }
                }
            };
            yield request.readRequestBody();
            runMiddleware();
        });
    }
    findRouteCallback(method, url) {
        const routeMap = this.routes[method];
        if (!routeMap)
            return undefined;
        const urlPath = url.split('?')[0];
        const pattern = new urlPattern(urlPath);
        const matchingPath = Object.keys(routeMap).find(path => pattern.match(path));
        return matchingPath ? routeMap[matchingPath] : undefined;
    }
    listen(port, callback) {
        this._server.listen(port, callback);
    }
    staticFile(folderPath) {
        this.get('/static/', (req, res) => {
            const fileName = req.params['file'];
            console.log('Requested static file:', fileName);
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
exports.MmdExpress = MmdExpress;
const mmdExpress = () => {
    return new MmdExpress();
};
exports.mmdExpress = mmdExpress;
// async function startServer() {
//     const app = mmdExpress();
//     app.use((req: Request, res: Response, next: () => void) => {
//         // Middleware example
//         console.log('Middleware is running!');
//         next();
//     });
//     app.get('/get', (req: Request, res: Response) => {
//         res.send('Hello from mmdexpress!');
//     });
//     app.post('/post', (req: Request, res: Response) => {
//         res.send(`Received a POST request with body:  ${JSON.stringify(req.body)}`);
//     });
//     app.put('/put', (req: Request, res: Response) => {
//         res.send(`params : ${JSON.stringify(req.params)} Received a POST request with body: ${JSON.stringify(req.body)}`);
//     });
//     app.delete('/delete', (req: Request, res: Response) => {
//         res.json(req.params);
//     })
//     app.get('/json', (req , res) => {
//         const jsonData = { message: 'Hello, this is a JSON response!' }
//         res.json(jsonData)
//     })
//     app.get('/redirect', (req , res) => {
//         setTimeout(() => {
//           res.redirect('/get')
//         }, 3000)
//     })
//     app.listen(3000, () => {
//         console.log('Server is running on port 3000');
//     });
// }
// startServer();
