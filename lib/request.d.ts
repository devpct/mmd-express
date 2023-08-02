/// <reference types="node" />
import { IncomingMessage } from 'node:http';
export declare class Request {
    request: IncomingMessage;
    method: string;
    url: string;
    headers: {
        [key: string]: string | string[] | undefined;
    };
    params: any;
    query: any;
    body: any;
    constructor(request: IncomingMessage);
    readRequestBody(): Promise<any>;
}
