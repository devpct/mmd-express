import { Request } from '../request';
import { Response, send } from '../response';

export function index(req: Request, res: Response): void {
    send(res, 'Hello World');
}
