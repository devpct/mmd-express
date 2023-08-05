"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const uri = require("url");
const qs = require("querystring");
class Request {
    constructor(request) {
        this.request = request;
        this.method = request.method || '';
        this.url = request.url || '';
        this.headers = Object.assign({}, request.headers) || {};
        const parsedUrl = uri.parse(this.url, true);
        this.query = qs.parse(qs.stringify(parsedUrl.query));
        const urlParts = this.url.split('/');
        urlParts.shift();
        const regex = /(\w+)=(\w+)/g;
        let match;
        this.params = {};
        const queryString = uri.format({ query: parsedUrl.query });
        while ((match = regex.exec(queryString)) !== null) {
            const key = match[1];
            const value = match[2];
            this.params[key] = value;
        }
        for (let i = 0; i < urlParts.length; i += 2) {
            const key = urlParts[i];
            const value = urlParts[i + 1];
            this.params[key] = value;
        }
    }
    get body() {
        return this._body;
    }
    readRequestBody() {
        return __awaiter(this, void 0, void 0, function* () {
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
                        }
                        else if (contentType.includes('application/x-www-form-urlencoded')) {
                            this._body = qs.parse(rawData);
                        }
                        else {
                            console.warn('Unsupported content type:', contentType);
                            this._body = null;
                        }
                        resolve(this._body);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
                this.request.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }
}
exports.Request = Request;
