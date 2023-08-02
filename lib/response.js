"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
class Response {
    constructor(response) {
        this.response = response;
    }
    status(code) {
        this.response.statusMessage = this.getStatusMessage(code);
        this.response.statusCode = code;
        return this;
    }
    send(body) {
        this.response.writeHead(this.response.statusCode, {
            'Content-Type': 'text/html'
        });
        this.response.end(body);
    }
    json(body) {
        this.response.writeHead(this.response.statusCode, {
            'Content-Type': 'application/json'
        });
        this.response.end(JSON.stringify(body));
    }
    redirect(url) {
        this.response.writeHead(302, {
            'Location': url,
        });
        this.response.end();
    }
    getStatusMessage(code) {
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
}
exports.Response = Response;
