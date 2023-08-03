import { IncomingMessage } from 'http';
import * as uri from 'url';
import * as qs from 'querystring';

export class Request {
    method: string;
    url: string;
    headers: { [key: string]: string | string[] | undefined };
    params: any;
    query: any;
    private _body?: any;

    constructor(public request: IncomingMessage) {
        this.method = request.method || '';
        this.url = request.url || '';
        this.headers = Object.assign({}, request.headers) || {};

        const parsedUrl = uri.parse(this.url, true);

        this.params = parsedUrl.query;
        this.query = parsedUrl.query;
    }

    get body(): any {
        return this._body;
    }

    async readRequestBody(): Promise<any> {
        return new Promise((resolve, reject) => {
            let rawData = '';
            this.request.on('data', (chunk) => {
                rawData += chunk;
            });

            this.request.on('end', () => {
                try {
                    const contentType = this.headers['content-type'] || '';

                    if (contentType.includes('application/json')) {
                        this._body = JSON.parse(rawData);
                    } else if (contentType.includes('application/x-www-form-urlencoded')) {
                        this._body = qs.parse(rawData);
                    } else {
                        console.warn('Unsupported content type:', contentType);
                        this._body = null;
                    }

                    resolve(this._body);
                } catch (err) {
                    reject(err);
                }
            });

            this.request.on('error', (err) => {
                reject(err);
            });
        });
    }
}

