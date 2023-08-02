import { ServerResponse } from 'node:http';

export interface Response {
    response: ServerResponse;
}

export function status(response: Response, code: number): Response {
    response.response.statusMessage = getStatusMessage(code);
    response.response.statusCode = code;
    return response;
}

export function send(response: Response, body: string): void {
    response.response.writeHead(response.response.statusCode, {
        'Content-Type': 'text/html'
    });
    response.response.end(body);
}

export function json(response: Response, body: object): void {
    response.response.writeHead(response.response.statusCode, {
        'Content-Type': 'application/json'
    });
    response.response.end(JSON.stringify(body));
}

export function redirect(response: Response, url: string): void {
    response.response.writeHead(302, {
        'Location': url,
    });
    response.response.end();
}

function getStatusMessage(code: number): string {
    // You can implement your own status messages for different status codes
    switch (code) {
        case 200:
            return 'OK';
        case 201:
            return 'Created';
        // Add other status messages here
        default:
            return '';
    }
}
