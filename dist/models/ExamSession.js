"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSession = void 0;
const mongoose_1 = require("mongoose");
const attemptSchema = new mongoose_1.Schema({
    choiceIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    timestamp: { type: Date, required: true },
});
const progressSchema = new mongoose_1.Schema({
    questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question', required: true },
    attempts: { type: [attemptSchema], default: [] },
});
const examSessionSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    setVersion: { type: Number, required: true },
    perQuestionProgress: { type: [progressSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['in_progress'], default: 'in_progress' },
});
exports.ExamSession = (0, mongoose_1.model)('ExamSession', examSessionSchema);
