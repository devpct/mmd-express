import { Request } from '../request'
import { Response } from '../response'

export class homeController {
    static index(req: Request, res: Response): void {
        res.send('Hello World')
    }
}