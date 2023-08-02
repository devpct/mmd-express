import { Request } from '../request';
import { Response } from '../response';
export declare class Middleware {
    static logRequest(req: Request, res: Response, next: Function): void;
}
