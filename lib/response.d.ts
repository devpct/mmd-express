/// <reference types="node" />
import { ServerResponse } from 'node:http';
export declare class Response {
    private response;
    private _statusCode;
    private _headers;
    private _body;
    private _isResponseSent;
    redirect(url: string): void;
    constructor(response: ServerResponse);
    status(code: number): this;
    send(data: any): void;
    json(data: any): void;
    setHeader(key: string, value: string | string[]): this;
    private _sendResponse;
}
