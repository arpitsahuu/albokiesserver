"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* imports */
require("dotenv").config({ path: "./.env" });
const express_1 = __importDefault(require("express"));
const dbConnection_1 = __importDefault(require("./src/models/dbConnection"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const events = require('events');
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = (0, express_1.default)();
events.EventEmitter.defaultMaxListeners = 20;
/* middleware */
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
(0, dbConnection_1.default)();
// Loger
const morgan_1 = __importDefault(require("morgan"));
app.use((0, morgan_1.default)("dev"));
// app.options('*', cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
// app.use(cors({
//   origin: 'https://albokoes.vercel.app', // Specify the allowed origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'], // Include any headers your client might send
//   credentials: true, // Set this to true if you need to send cookies or other credentials
// }));
//tsc && node dist/app.js 
const allowedOrigins = [
    'https://albokoes.vercel.app/',
    'https://albokoes-y64n.vercel.app',
    'https://www.albokoes.com/', // There's an extra comma after this line
    'http://localhost:3000',
    'https://albokoes.vercel.app/', // This is repeated
    'https://albokoes-y64n.vercel.app', // This is repeated
    'https://www.albokoes.com',
    'https://www.albokoes.in/'
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200, // Respond with a success status for OPTIONS requests
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-Auth-Token'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
/* router */
const userRouter_1 = __importDefault(require("./src/routes/userRouter"));
const errorMiddleware_1 = __importDefault(require("./src/middlewares/errorMiddleware"));
const serviceRouter_1 = __importDefault(require("./src/routes/serviceRouter"));
const newarticalRouter_1 = __importDefault(require("./src/routes/newarticalRouter"));
const eventRouters_1 = __importDefault(require("./src/routes/eventRouters"));
const analyticsRouter_1 = __importDefault(require("./src/routes/analyticsRouter"));
app.get("/", (req, res) => {
    res.json({ greed: "welcome to albokoes" });
});
app.use("/api/v1", userRouter_1.default, serviceRouter_1.default, newarticalRouter_1.default, eventRouters_1.default, analyticsRouter_1.default);
/* 404 */
app.get("*", (req, res) => {
    res.status(404).json({
        message: "Not Found",
    });
});
/* error Handling */
app.use(errorMiddleware_1.default);
/* server */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
