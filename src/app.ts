import { Request } from './request';
import { Response } from './response';
import { Middleware } from './middleware/middleware';
import * as path from 'path';
import * as fs from 'fs'
import { IncomingMessage, ServerResponse } from 'http';
import * as http from 'node:http';


type RouteCallback = (
    req: Request,
    res: Response
) => void;

interface RouteMap {
    [path: string]: RouteCallback;
}

export class Router {
    private _server: http.Server;
    private routes: Record<string, RouteMap> = {
        'GET': {},
        'POST': {},
        'PUT': {},
        'DELETE': {},
    };
    
    private middlewares: ((req: Request, res: Response, next: () => void) => void)[] = [];

    constructor() {
        this._server = http.createServer(async(
            req: http.IncomingMessage, 
            res: http.ServerResponse
        ) => {
            const response = new Response(res);
            const request = new Request(req);

            await request.readRequestBody();
        });
    }

    use(middleware: (req: Request, res: Response, next: () => void) => void) {
        this.middlewares.push(middleware);
    }

    get(path: string, callback: RouteCallback) {
        this.routes['GET'][path] = callback;
    }

    post(path: string, callback: RouteCallback) {
        this.routes['POST'][path] = callback;
    }

    handleRequest(req: IncomingMessage, res: ServerResponse) {
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
                const method = req.method || 'GET';
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
        const http = require('http');
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(port, callback);
    }

    staticFile(folderPath: string) {
        this.get('/static/', (req: Request, res: Response) => {
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

export const router = (): Router => {
    return new Router();
};
const app = router();

app.use((req: Request, res: Response, next: () => void) => {
    // Middleware example
    console.log('Middleware is running!');
    next();
});

app.use(Middleware.logRequest);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from mmdexpress!');
});

// Static file serving
function staticFile(folderPath: string, req: Request, res: Response) {
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
