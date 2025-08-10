"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishQuestionSetSchema = exports.upsertQuestionSchema = exports.hintSchema = void 0;
const zod_1 = require("zod");
exports.hintSchema = zod_1.z.object({
    level: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3)]),
    text: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url().optional(),
});
exports.upsertQuestionSchema = zod_1.z.object({
    setVersion: zod_1.z.number().int().min(1),
    index: zod_1.z.number().int().min(1).max(20),
    promptText: zod_1.z.string().min(1),
    promptImageUrl: zod_1.z.string().url().optional(),
    choices: zod_1.z.array(zod_1.z.object({ text: zod_1.z.string().min(1) })).length(4),
    correctIndex: zod_1.z.number().int().min(0).max(3),
    hints: zod_1.z.array(exports.hintSchema).length(3),
    firstTryExplanation: zod_1.z.object({ text: zod_1.z.string().min(1), imageUrl: zod_1.z.string().url().optional() }).optional(),
});
exports.publishQuestionSetSchema = zod_1.z.object({
    version: zod_1.z.number().int().min(1),
    questions: zod_1.z.array(exports.upsertQuestionSchema.omit({ setVersion: true })).min(1).max(20),
});
