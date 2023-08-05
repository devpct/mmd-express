"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
class Response {
    redirect(url) {
        if (this._isResponseSent) {
            throw new Error('Response has already been sent.');
        }
        this.setHeader('Location', url);
        this.status(302).send('Redirecting...');
    }
    constructor(response) {
        this.response = response;
        this._headers = {};
        this._isResponseSent = false;
        this._statusCode = 200;
    }
    status(code) {
        this._statusCode = code;
        return this;
    }
    send(data) {
        if (this._isResponseSent) {
            throw new Error('Response has already been sent.');
        }
        this._body = data;
        this._sendResponse();
    }
    json(data) {
        this.setHeader('Content-Type', 'application/json');
        this.send(JSON.stringify(data));
    }
    setHeader(key, value) {
        this._headers[key.toLowerCase()] = value;
        return this;
    }
    _sendResponse() {
        if (this._isResponseSent) {
            return;
        }
        this._isResponseSent = true;
        this.response.writeHead(this._statusCode, this._headers);
        this.response.end(this._body);
    }
}
exports.Response = Response;
