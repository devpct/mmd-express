import { Request } from '../request';
import { Response } from '../response';
export declare class middleware {
    static logRequest(req: Request, res: Response, next: Function): void;
}
