"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveQuestions = getActiveQuestions;
const Question_1 = require("../models/Question");
async function getActiveQuestions(_req, res) {
    const q = await Question_1.Question.findOne().sort({ setVersion: -1 }).lean();
    const setVersion = q?.setVersion || 1;
    const items = await Question_1.Question.find({ setVersion }).sort({ index: 1 }).lean();
    return res.json({ setVersion, items });
}
