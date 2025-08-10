"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const exam_routes_1 = __importDefault(require("./routes/exam.routes"));
const questions_routes_1 = __importDefault(require("./routes/questions.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
async function bootstrap() {
    await (0, db_1.connectDatabase)();
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: env_1.env.corsOrigin, credentials: true }));
    app.use(express_1.default.json({ limit: '5mb' }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, morgan_1.default)('dev'));
    app.get('/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/auth', auth_routes_1.default);
    app.use('/exam', exam_routes_1.default);
    app.use('/questions', questions_routes_1.default);
    app.use('/admin', admin_routes_1.default);
    app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
    app.use(errorHandler_1.errorHandler);
    app.listen(env_1.env.port, () => {
        console.log(`Server listening on http://localhost:${env_1.env.port}`);
    });
}
bootstrap().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
});
