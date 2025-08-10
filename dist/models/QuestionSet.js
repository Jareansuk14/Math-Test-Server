"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSet = void 0;
const mongoose_1 = require("mongoose");
const questionSetSchema = new mongoose_1.Schema({
    version: { type: Number, required: true, unique: true },
    isActive: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
});
exports.QuestionSet = (0, mongoose_1.model)('QuestionSet', questionSetSchema);
