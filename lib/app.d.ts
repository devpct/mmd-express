/// <reference types="node" />
import { Request } from './request';
import { Response } from './response';
import { IncomingMessage, ServerResponse } from 'http';
type RouteCallback = (req: Request, res: Response) => void;
export declare class MmdExpress {
    private _server;
    private routes;
    private middlewares;
    constructor();
    use(middleware: (req: Request, res: Response, next: () => void) => void): void;
    get(path: string, callback: RouteCallback): void;
    post(path: string, callback: RouteCallback): void;
    put(path: string, callback: RouteCallback): void;
    delete(path: string, callback: RouteCallback): void;
    handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void>;
    findRouteCallback(method: string, url: string): RouteCallback | undefined;
    listen(port: number, callback: () => void): void;
    staticFile(folderPath: string): void;
}
export declare const mmdExpress: () => MmdExpress;
export {};
