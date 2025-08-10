"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerSchema = exports.startExamSchema = void 0;
const zod_1 = require("zod");
exports.startExamSchema = zod_1.z.object({});
exports.answerSchema = zod_1.z.object({
    questionId: zod_1.z.string().min(1),
    choiceIndex: zod_1.z.number().int().min(0).max(3),
});
