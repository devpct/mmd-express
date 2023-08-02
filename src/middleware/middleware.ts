import { Request } from '../request';
import { Response } from '../response';

export class middleware {
    public static logRequest(req: Request, res: Response, next: Function) {
        console.log(`Received ${req.method} request at ${req.url}`);
        next();
    }
}
