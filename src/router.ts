import { IncomingMessage, ServerResponse } from 'node:http';
import { Request } from './request';
import { Response } from './response';

type RouteCallback = (
    req: Request,
    res: Response
) => void;

interface RouteMap {
    [path: string]: RouteCallback;
}

export class Router {
    private routes: Record<string, RouteMap> = {
        'GET': {},
        'POST': {},
        'PUT': {},
        'DELETE': {},
    };
    
    private middlewares: ((req: Request, res: Response, next: () => void) => void)[] = [];

    constructor() {
        // Implementation of the Router class
        // For example, we can initialize the middlewares here
        this.middlewares.push((req: Request, res: Response, next: () => void) => {
            console.log('Executing middleware 1');
            next();
        });
        this.middlewares.push((req: Request, res: Response, next: () => void) => {
            console.log('Executing middleware 2');
            next();
        });
    }

    use(middleware: (req: Request, res: Response, next: () => void) => void) {
        // Implementation of adding middleware
        this.middlewares.push(middleware);
    }

    get(path: string, callback: RouteCallback) {
        // Implementation of defining a GET route
        this.routes['GET'][path] = callback;
    }

    post(path: string, callback: RouteCallback) {
        // Implementation of defining a POST route
        this.routes['POST'][path] = callback;
    }

    handleRequest(req: IncomingMessage, res: ServerResponse) {
        // Implementation of handling requests
        const request = new Request(req);
        const response = new Response(res);
    
        // Execute middleware stack before handling the request
        let currentMiddlewareIndex = 0;
        const runMiddleware = () => {
            if (currentMiddlewareIndex < this.middlewares.length) {
                const currentMiddleware = this.middlewares[currentMiddlewareIndex];
                currentMiddleware(request, response, () => {
                    currentMiddlewareIndex++;
                    runMiddleware();
                });
            } else {
                // All middleware functions have been executed, handle the request
                const method = req.method ?? 'GET';
                const url = req.url || '';
    
                const routeCallback = this.routes[method][url];
                if (routeCallback) {
                    routeCallback(request, response);
                } else {
                    // Handle 404 Not Found
                    response.status(404).send('Not Found');
                }
            }
        };
    
        runMiddleware();
    }    

    listen(port: number, callback: () => void) {
        // Implementation of starting the server
        const http = require('http');
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(port, callback);
    }
}
