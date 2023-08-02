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
                            resolve(JSON.parse(rawData));
                        }
                        else if (contentType.includes('application/x-www-form-urlencoded')) {
                            resolve(qs.parse(rawData));
                        }
                        else {
                            console.warn('Unsupported content type:', contentType);
                            resolve(null);
                        }
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
