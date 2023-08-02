import { Request } from '../request';
import { Response } from '../response';

export class HomeController {
    static index(req: Request, res: Response): void {
        // Implementation of the home page controller
        res.send('Hello World');
    }
}
