import * as http from 'node:http';
import { Request, createRequest } from './request';
import { Response, status, send, json } from './response';
import { logRequest } from './middleware/middleware';
import * as path from 'path';
import * as fs from 'fs';

type RouteCallback = (
    req: Request,
    res: Response
) => void;

interface RouteMap {
    [path: string]: RouteCallback;
}

const routes: Record<string, RouteMap> = {
    'GET': {},
    'POST': {},
    'PUT': {},
    'DELETE': {},
};

const middlewares: ((req: Request, res: Response, next: () => void) => void)[] = [];

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const request = await createRequest(req);
    const response: Response = { response: res };

    console.log('Received a request:', req.url);
    handleRequest(request, response);
});

function use(middleware: (req: Request, res: Response, next: () => void) => void) {
    middlewares.push(middleware);
}

function get(path: string, callback: RouteCallback) {
    routes['GET'][path] = callback;
}

function post(path: string, callback: RouteCallback) {
    routes['POST'][path] = callback;
}

function handleRequest(req: Request, res: Response) {
    // Execute middleware stack before handling the request
    let currentMiddlewareIndex = 0;
    const runMiddleware = () => {
        if (currentMiddlewareIndex < middlewares.length) {
            const currentMiddleware = middlewares[currentMiddlewareIndex];
            currentMiddleware(req, res, () => {
                currentMiddlewareIndex++;
                runMiddleware();
            });
        } else {
            // All middleware functions have been executed, handle the request
            const method = req.method || 'GET';
            const url = req.url || '';

            const routeCallback = routes[method][url];
            if (routeCallback) {
                routeCallback(req, res);
            } else {
                // Handle 404 Not Found
                status(res, 404);
                send(res, 'Not Found');
            }
        }
    };

    runMiddleware();
}

function listen(port: number, callback: () => void) {
    server.listen(port, callback);
}

function staticFile(folderPath: string) {
    get('/static/', (req: Request, res: Response) => {
        const fileName = req.params['file'];
        console.log('Requested static file:', fileName);
        fs.readFile(path.join(folderPath, fileName), (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            send(res, data.toString());
        });
    });
}

export {
    use,
    get,
    post,
    handleRequest,
    listen,
    staticFile,
};

use(logRequest);

get('/', (req: Request, res: Response) => {
    send(res, 'Hello from mmdexpress!');
});

listen(3000, () => {
    console.log('Server is running on port 3000');
});
