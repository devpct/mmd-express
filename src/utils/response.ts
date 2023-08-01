import { ServerResponse } from 'node:http';
import IResponse  from '../interfaces/interfaceResponse';

export default class Response implements IResponse {
    constructor(public response: ServerResponse) {}

    // Status codes not complete but complete on the future
    status(code: number): Response {
        switch (code) {
            case 200:
                this.response.statusMessage = 'OK';
                this.response.statusCode = code;
                return this;
            case 201:
                this.response.statusMessage = 'Created';
                this.response.statusCode = code;
                return this;
            case 204:
                this.response.statusMessage = 'No Content';
                this.response.statusCode = code;
                return this;
            case 301:
                this.response.statusMessage = 'Moved Permanently';
                this.response.statusCode = code;
                return this;
            case 302: 
                this.response.statusMessage = 'Moved Temporarily';
                this.response.statusCode = code;
                return this;
            case 304:
                this.response.statusMessage = 'Not Modified';
                this.response.statusCode = code;
                return this;
            case 400:
                this.response.statusMessage = 'Bad Request';
                this.response.statusCode = code;
                return this;
            case 401:
                this.response.statusMessage = 'Unauthorized';
                this.response.statusCode = code;
                return this;
            case 403:
                this.response.statusMessage = 'Forbidden';
                this.response.statusCode = code;
                return this;
            case 404:
                this.response.statusMessage = 'Not Found';
                this.response.statusCode = code;
                return this;
            case 405:
                this.response.statusMessage = 'Method Not Allowed';
                this.response.statusCode = code;
                return this;
            case 409:
                this.response.statusMessage = 'Conflict';
                this.response.statusCode = code;
                return this;
            case 500:
                this.response.statusMessage = 'Internal Server Error';
                this.response.statusCode = code;
                return this;
            case 501:
                this.response.statusMessage = 'Not Implemented';
                this.response.statusCode = code;
                return this;
            case 503:
                this.response.statusMessage = 'Service Unavailable';
                this.response.statusCode = code;
                return this;
            case 504:
                this.response.statusMessage = 'Gateway Timeout';
                this.response.statusCode = code;
                return this;
            case 505:
                this.response.statusMessage = 'HTTP Version Not Supported';
                this.response.statusCode = code;
                return this;
            case 507:
                this.response.statusMessage = 'Insufficient Storage';
                this.response.statusCode = code;
                return this;
            case 511:
                this.response.statusMessage = 'Network Authentication Required';
                this.response.statusCode = code;
                return this;
            case 599:
                this.response.statusMessage = 'Network Connect Timeout Error';
                this.response.statusCode = code;
                return this;
            default:
                return this;
        }
    }

    send(body: string): void {
        this.response.writeHead(this.response.statusCode, {
            'Content-Type': 'text/html'
        });
        this.response.end(body);
    }

    json(body: object): void {
        this.response.writeHead(this.response.statusCode, {
            'Content-Type': 'application/json' 
        });
        this.response.end(JSON.stringify(body));
    }

    redirect(url: string): void {
        this.response.writeHead(302, {
            'Location': url,
        });
        this.response.end();
    }
}