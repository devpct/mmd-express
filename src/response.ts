import { ServerResponse } from 'node:http';

export class Response {
    private _statusCode: number;
    private _headers: { [key: string]: string | string[] } = {};
    private _body: any;
    private _isResponseSent: boolean = false;

    constructor(private response: ServerResponse) {
        this._statusCode = 200;
    }

    status(code: number): this {
        this._statusCode = code;
        return this;
    }

    send(data: any): void {
        if (this._isResponseSent) {
            throw new Error('Response has already been sent.');
        }

        this._body = data;
        this._sendResponse();
    }

    json(data: any): void {
        this.setHeader('Content-Type', 'application/json');
        this.send(JSON.stringify(data));
    }

    setHeader(key: string, value: string | string[]): this {
        this._headers[key.toLowerCase()] = value;
        return this;
    }

    private _sendResponse(): void {
        if (this._isResponseSent) {
            return;
        }

        this._isResponseSent = true;

        this.response.writeHead(this._statusCode, this._headers);
        this.response.end(this._body);
    }
}
