"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const app = new app_1.default();
app.get('/', (req, res) => {
    res.json({ message: 'Hello from MohammadExpress!' });
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
