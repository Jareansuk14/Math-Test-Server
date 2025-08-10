"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishQuestionSet = publishQuestionSet;
exports.listStudents = listStudents;
exports.listResults = listResults;
exports.getUploadUrl = getUploadUrl;
exports.getViewUrl = getViewUrl;
const zod_1 = require("zod");
const question_schema_1 = require("../validators/question.schema");
const Question_1 = require("../models/Question");
const QuestionSet_1 = require("../models/QuestionSet");
const Student_1 = require("../models/Student");
const ExamResult_1 = require("../models/ExamResult");
const s3_service_1 = require("../services/s3.service");
async function publishQuestionSet(req, res) {
    const parsed = question_schema_1.publishQuestionSetSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: parsed.error.message });
    const { version, questions } = parsed.data;
    const exists = await QuestionSet_1.QuestionSet.findOne({ version });
    if (exists)
        return res.status(409).json({ message: 'Version already exists' });
    await Question_1.Question.insertMany(questions.map((q, idx) => ({
        setVersion: version,
        index: idx + 1,
        promptText: q.promptText,
        promptImageUrl: q.promptImageUrl,
        choices: q.choices,
        correctIndex: q.correctIndex,
        hints: q.hints,
        firstTryExplanation: q.firstTryExplanation,
    })));
    await QuestionSet_1.QuestionSet.create({ version, isActive: true });
    // deactivate previous versions
    await QuestionSet_1.QuestionSet.updateMany({ version: { $ne: version } }, { $set: { isActive: false } });
    return res.json({ message: 'Published', version });
}
async function listStudents(_req, res) {
    const items = await Student_1.Student.find().sort({ createdAt: -1 }).lean();
    // Transform ObjectId to string for frontend compatibility
    const transformedItems = items.map(item => ({
        ...item,
        id: item._id.toString()
    }));
    res.json(transformedItems);
}
async function listResults(_req, res) {
    const items = await ExamResult_1.ExamResult.find().sort({ completedAt: -1 }).lean();
    // Transform ObjectId to string for frontend compatibility
    const transformedItems = items.map(item => ({
        ...item,
        _id: item._id.toString(),
        studentId: item.studentId.toString(),
        perQuestion: item.perQuestion.map(pq => ({
            ...pq,
            questionId: pq.questionId.toString()
        }))
    }));
    res.json(transformedItems);
}
async function getUploadUrl(req, res) {
    const schema = zod_1.z.object({ key: zod_1.z.string().min(1), contentType: zod_1.z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: parsed.error.message });
    const url = (0, s3_service_1.getPresignedUploadUrl)(parsed.data.key, parsed.data.contentType);
    res.json({ url });
}
async function getViewUrl(req, res) {
    const schema = zod_1.z.object({ key: zod_1.z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: parsed.error.message });
    const url = (0, s3_service_1.getPresignedViewUrl)(parsed.data.key);
    res.json({ url });
}
