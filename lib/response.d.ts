/// <reference types="node" />
import { ServerResponse } from 'node:http';
export declare class Response {
    response: ServerResponse;
    constructor(response: ServerResponse);
    status(code: number): Response;
    send(body: string): void;
    json(body: object): void;
    redirect(url: string): void;
    private getStatusMessage;
}
