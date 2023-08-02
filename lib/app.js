"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const middleware_1 = require("./middleware/middleware");
const path = require("path");
const fs = require("fs");
const app = new router_1.Router();
app.use((req, res, next) => {
    // Middleware example
    console.log('Middleware is running!');
    next();
});
app.use(middleware_1.Middleware.logRequest);
app.get('/', (req, res) => {
    res.send('Hello from mmdexpress!');
});
// Static file serving
function staticFile(folderPath, req, res) {
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
