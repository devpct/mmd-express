import { Request } from '../request';
import { Response } from '../response';

export class Middleware {
    public static logRequest(req: Request, res: Response, next: Function) {
        console.log(`Received ${req.method} request at ${req.url}`);
        next();
    }
}
