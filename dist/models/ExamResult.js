"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamResult = void 0;
const mongoose_1 = require("mongoose");
const attemptSchema = new mongoose_1.Schema({
    choiceIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    timestamp: { type: Date, required: true },
});
const questionResultSchema = new mongoose_1.Schema({
    questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question', required: true },
    firstAttemptCorrect: { type: Boolean, required: true },
    wrongAttemptsCount: { type: Number, required: true },
    attempts: { type: [attemptSchema], default: [] },
});
const examResultSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    setVersion: { type: Number, required: true },
    perQuestion: { type: [questionResultSchema], default: [] },
    realScore: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, required: true },
});
exports.ExamResult = (0, mongoose_1.model)('ExamResult', examResultSchema);
