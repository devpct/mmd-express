import { Router } from './router';
import { Request } from './request';
import { Response } from './response';
import { Middleware } from './middleware/middleware';
import { HomeController } from './controller/homeController';
import * as path from 'path';

const app = new Router();

app.use((req: Request, res: Response, next: () => void) => {
    // Middleware example
    console.log('Middleware is running!');
    next();
});

app.use(Middleware.logRequest);

const publicFolder = path.join(__dirname, 'public');
app.staticFile(publicFolder);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from mmdexpress!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
