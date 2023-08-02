import { Request } from '../request';
import { Response } from '../response';

export function logRequest(req: Request, res: Response, next: Function) {
    console.log(`Received ${req.method} request at ${req.url}`);
    next();
}
