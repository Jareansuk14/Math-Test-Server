"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = require("mongoose");
const hintSchema = new mongoose_1.Schema({
    level: { type: Number, enum: [1, 2, 3], required: true },
    text: { type: String, required: true },
    imageUrl: { type: String },
});
const questionSchema = new mongoose_1.Schema({
    setVersion: { type: Number, required: true, index: true },
    index: { type: Number, required: true, min: 1, max: 20, index: true },
    promptText: { type: String, required: true },
    promptImageUrl: { type: String },
    choices: [{ text: { type: String, required: true } }],
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    hints: { type: [hintSchema], default: [] },
    firstTryExplanation: { text: { type: String }, imageUrl: { type: String } },
    updatedAt: { type: Date, default: Date.now },
});
questionSchema.index({ setVersion: 1, index: 1 }, { unique: true });
exports.Question = (0, mongoose_1.model)('Question', questionSchema);
