"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: errorMessages,
                });
            }
            next(error);
        }
    };
};
exports.validateBody = validateBody;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validatedParams = schema.parse(req.params);
            req.params = validatedParams;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    message: 'Invalid parameters',
                    errors: errorMessages,
                });
            }
            next(error);
        }
    };
};
exports.validateParams = validateParams;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validatedQuery = schema.parse(req.query);
            req.query = validatedQuery;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    message: 'Invalid query parameters',
                    errors: errorMessages,
                });
            }
            next(error);
        }
    };
};
exports.validateQuery = validateQuery;
