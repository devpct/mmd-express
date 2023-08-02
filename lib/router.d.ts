/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Request } from './request';
import { Response } from './response';
type RouteCallback = (req: Request, res: Response) => void;
export declare class Router {
    private routes;
    private middlewares;
    constructor();
    use(middleware: (req: Request, res: Response, next: () => void) => void): void;
    get(path: string, callback: RouteCallback): void;
    post(path: string, callback: RouteCallback): void;
    handleRequest(req: IncomingMessage, res: ServerResponse): void;
    listen(port: number, callback: () => void): void;
    staticFile(folderPath: string): void;
}
export {};
