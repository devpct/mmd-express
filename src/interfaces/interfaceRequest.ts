import { IncomingMessage } from 'node:http';

export default interface IRequest {
    request: IncomingMessage

    method: string;
    url: string;

    headers: { [key: string]: string | string[] | undefined };

    params: any;
    query: any;
    body: any;
    
    readRequestBody: () => Promise<any>;
}