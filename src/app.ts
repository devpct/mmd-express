import { Router } from './router';
import { Request } from './request';
import { Response } from './response';
import { Middleware } from './middleware/middleware';
import * as path from 'path';
import * as fs from 'fs'

const app = new Router();

app.use((req: Request, res: Response, next: () => void) => {
    // Middleware example
    console.log('Middleware is running!');
    next();
});

app.use(Middleware.logRequest);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from mmdexpress!');
});

// Static file serving
function staticFile(folderPath: string, req: Request, res: Response) {
    const fileName = req.params['file'];
    fs.readFile(path.join(folderPath, fileName), (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        res.send(data.toString());
    });
}

const publicFolder = path.join(__dirname, 'public');
app.get('/static/:file', staticFile.bind(null, publicFolder));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
