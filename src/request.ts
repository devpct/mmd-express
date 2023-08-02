import { IncomingMessage } from 'node:http';
import * as uri from 'url';
import * as qs from 'querystring';

export class Request {
    method: string;
    url: string;
    headers: { [key: string]: string | string[] | undefined };
    params: any;
    query: any;
    body: any;

    constructor(public request: IncomingMessage) {
        this.method = request.method || '';
        this.url = request.url || '';
        this.headers = Object.assign({}, request.headers) || {};

        const parsedUrl = uri.parse(this.url, true);

        this.params = parsedUrl.query;
        this.query = parsedUrl.query;

        this.readRequestBody()
            .then((body) => {
                this.body = body;
            })
            .catch((err) => {
                console.error('Error parsing request body:', err);
            });
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
                        resolve(JSON.parse(rawData));
                    } else if (contentType.includes('application/x-www-form-urlencoded')) {
                        resolve(qs.parse(rawData));
                    } else {
                        console.warn('Unsupported content type:', contentType);
                        resolve(null);
                    }
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
