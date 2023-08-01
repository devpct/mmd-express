import { ServerResponse } from 'node:http';

export default interface IResponse {
    response: ServerResponse;

    status(code: number): IResponse;

    send(body: string): void;
    json(body: object): void;
    redirect(url: string): void;
}