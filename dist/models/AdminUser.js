"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUser = void 0;
const mongoose_1 = require("mongoose");
const adminUserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
    createdAt: { type: Date, default: Date.now },
});
exports.AdminUser = (0, mongoose_1.model)('AdminUser', adminUserSchema);
