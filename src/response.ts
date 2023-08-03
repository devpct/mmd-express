import { ServerResponse } from 'http';

export class Response {
    constructor(public response: ServerResponse) {}

    status(code: number): Response {
        this.response.statusMessage = this.getStatusMessage(code);
        this.response.statusCode = code;
        return this;
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

    private getStatusMessage(code: number): string {
        switch (code) {
            case 200:
                return 'OK';
            case 201:
                return 'Created';
            default:
                return '';
        }
    }
}
