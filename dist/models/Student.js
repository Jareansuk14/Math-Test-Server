"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    studentId: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true },
    school: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.Student = (0, mongoose_1.model)('Student', studentSchema);
