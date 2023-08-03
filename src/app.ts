import * as http from 'node:http';
import { Request } from './request';
import { Response } from './response';
import * as path from 'path';
import * as fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import * as urlPattern from 'url-pattern';

type RouteCallback = (
    req: Request,
    res: Response
) => void;

interface RouteMap {
    [path: string]: RouteCallback;
}

export class MmdExpress {
    private _server: http.Server;
    private routes: Record<string, RouteMap> = {
        'GET': {},
        'POST': {},
        'PUT': {},
        'DELETE': {},
    };
    
    private middlewares: ((req: Request, res: Response, next: () => void) => void)[] = [];

    constructor() {
        this._server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
            const response = new Response(res);
            const request = new Request(req);
    
            console.log('Received a request:', req.url);
            // await request.readRequestBody();
            this.handleRequest(req, res);
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

    put(path: string, callback: RouteCallback) {    
        this.routes['PUT'][path] = callback;
    }

    delete(path: string, callback: RouteCallback) {    
        this.routes['DELETE'][path] = callback;
    }

    async handleRequest(req: IncomingMessage, res: ServerResponse) {
        const request = new Request(req);
        const response = new Response(res);

        // Define the next function to be passed to middlewares
        const next = () => {
            currentMiddlewareIndex++;
            runMiddleware();
        };

        // Execute middleware stack before handling the request
        let currentMiddlewareIndex = 0;
        const runMiddleware = () => {
            if (currentMiddlewareIndex < this.middlewares.length) {
                const currentMiddleware = this.middlewares[currentMiddlewareIndex];
                currentMiddleware(request, response, next);
            } else {
                // All middleware functions have been executed, handle the request
                const method = req.method ?? 'GET';
                const url = req.url ?? '';

                const routeCallback = this.findRouteCallback(method, url);
                if (routeCallback) {
                    try {
                        routeCallback(request, response);
                    } catch (error) {
                        response.status(500).json({ message: 'Internal server error' });
                        console.error('Error: ', error);
                    }
                } else {
                    // Handle 404 Not Found
                    response.status(404).send('Not Found');
                }
            }
        };

        await request.readRequestBody();

        runMiddleware();
    }

    findRouteCallback(method: string, url: string): RouteCallback | undefined {
        const routeMap = this.routes[method];
        if (!routeMap) return undefined;

        const urlPath = url.split('?')[0];
        const pattern = new urlPattern(urlPath);
        const matchingPath = Object.keys(routeMap).find(path => pattern.match(path));

        return matchingPath ? routeMap[matchingPath] : undefined;
    }
    

    listen(port: number, callback: () => void) {
        this._server.listen(port, callback);
    }

    staticFile(folderPath: string) {
        this.get('/static/', (req: Request, res: Response) => {
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

export const mmdExpress = (): MmdExpress => {
    return new MmdExpress();
};

async function startServer() {
    const app = mmdExpress();

    app.use((req: Request, res: Response, next: () => void) => {
        // Middleware example
        console.log('Middleware is running!');
        next();
    });

    // app.get('/get', (req: Request, res: Response) => {
    //     res.send('Hello from mmdexpress!');
    // });

    // app.post('/post', (req: Request, res: Response) => {
    //     res.send(`Received a POST request with body:  ${JSON.stringify(req.body)}`);
    // });

    // app.put('/put', (req: Request, res: Response) => {
    //     res.send(`params : ${JSON.stringify(req.params)} Received a POST request with body: ${JSON.stringify(req.body)}`);
    // });
    
    // app.delete('/delete', (req: Request, res: Response) => {
    //     res.json(req.params);
    // })


    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

startServer();
