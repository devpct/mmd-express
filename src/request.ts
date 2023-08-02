import { IncomingMessage } from 'node:http';
import * as uri from 'url';
import * as qs from 'querystring';

export interface Request {
    method: string;
    url: string;
    headers: { [key: string]: string | string[] | undefined };
    params: any;
    query: any;
    body: any;
}

export function createRequest(request: IncomingMessage): Promise<Request> {
    return new Promise((resolve, reject) => {
        const req: Request = {
            method: request.method || '',
            url: request.url || '',
            headers: Object.assign({}, request.headers) || {},
            params: {},
            query: {},
            body: {}
        };

        const parsedUrl = uri.parse(req.url, true);
        req.params = parsedUrl.query;
        req.query = parsedUrl.query;

        readRequestBody(request)
            .then((body) => {
                req.body = body;
                resolve(req);
            })
            .catch((err) => {
                console.error('Error parsing request body:', err);
                reject(err);
            });
    });
}

function readRequestBody(request: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let rawData = '';
        request.on('data', (chunk) => {
            rawData += chunk;
        });

        request.on('end', () => {
            try {
                const contentType = request.headers['content-type'] || '';

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

        request.on('error', (err) => {
            reject(err);
        });
    });
}
