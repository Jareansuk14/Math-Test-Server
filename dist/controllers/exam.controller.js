"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExam = startExam;
exports.submitAnswer = submitAnswer;
exports.completeExam = completeExam;
exports.getSummary = getSummary;
const exam_schema_1 = require("../validators/exam.schema");
const ExamSession_1 = require("../models/ExamSession");
const ExamResult_1 = require("../models/ExamResult");
const Question_1 = require("../models/Question");
const hint_service_1 = require("../services/hint.service");
const scoring_service_1 = require("../services/scoring.service");
async function startExam(req, res) {
    if (!req.user || req.user.role !== 'student')
        return res.status(401).json({ message: 'Unauthorized' });
    const studentId = req.user.sub;
    const activeQuestion = await Question_1.Question.findOne().sort({ setVersion: -1 }).lean();
    const setVersion = activeQuestion?.setVersion || 1;
    const existing = await ExamSession_1.ExamSession.findOne({ studentId, setVersion, status: 'in_progress' });
    if (existing)
        return res.json({ sessionId: existing.id, setVersion });
    const questions = await Question_1.Question.find({ setVersion }).sort({ index: 1 }).select('_id').lean();
    const perQuestionProgress = questions.map(q => ({ questionId: q._id, attempts: [] }));
    const session = await ExamSession_1.ExamSession.create({ studentId, setVersion, perQuestionProgress });
    return res.json({ sessionId: session.id, setVersion });
}
async function submitAnswer(req, res) {
    if (!req.user || req.user.role !== 'student')
        return res.status(401).json({ message: 'Unauthorized' });
    const parsed = exam_schema_1.answerSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: parsed.error.message });
    const { questionId, choiceIndex } = parsed.data;
    const sessionId = req.params.sessionId;
    const session = await ExamSession_1.ExamSession.findById(sessionId);
    if (!session)
        return res.status(404).json({ message: 'Session not found' });
    if (String(session.studentId) !== req.user.sub)
        return res.status(403).json({ message: 'Forbidden' });
    const q = await Question_1.Question.findById(questionId);
    if (!q)
        return res.status(404).json({ message: 'Question not found' });
    const progress = session.perQuestionProgress.find(p => String(p.questionId) === String(questionId));
    if (!progress)
        return res.status(400).json({ message: 'Question not in session' });
    const isCorrect = choiceIndex === q.correctIndex;
    progress.attempts.push({ choiceIndex, isCorrect, timestamp: new Date() });
    await session.save();
    const wrongAttempts = progress.attempts.filter(a => !a.isCorrect).length;
    const hintLevel = isCorrect ? null : (0, hint_service_1.nextHintLevel)(wrongAttempts);
    const currentIndex = await Question_1.Question.countDocuments({ setVersion: q.setVersion, index: { $lte: q.index } });
    const totalQuestions = await Question_1.Question.countDocuments({ setVersion: q.setVersion });
    const nextIndex = isCorrect ? (currentIndex < totalQuestions ? currentIndex + 1 : null) : currentIndex;
    return res.json({ isCorrect, hintLevel, nextIndex });
}
async function completeExam(req, res) {
    if (!req.user || req.user.role !== 'student')
        return res.status(401).json({ message: 'Unauthorized' });
    const sessionId = req.params.sessionId;
    const session = await ExamSession_1.ExamSession.findById(sessionId);
    if (!session)
        return res.status(404).json({ message: 'Session not found' });
    if (String(session.studentId) !== req.user.sub)
        return res.status(403).json({ message: 'Forbidden' });
    // Build results only if all 20 questions have at least one correct attempt
    const questions = await Question_1.Question.find({ setVersion: session.setVersion }).sort({ index: 1 });
    const perQuestion = questions.map(q => {
        const progress = session.perQuestionProgress.find(p => String(p.questionId) === String(q.id));
        const attempts = progress?.attempts || [];
        const firstAttemptCorrect = attempts[0]?.isCorrect === true;
        const wrongAttemptsCount = attempts.filter(a => !a.isCorrect).length;
        return { questionId: q._id, firstAttemptCorrect, wrongAttemptsCount, attempts };
    });
    const allAnsweredCorrectly = perQuestion.every(pq => pq.attempts.some(a => a.isCorrect));
    if (!allAnsweredCorrectly) {
        return res.status(400).json({ message: 'Exam not completed. Some questions are not answered correctly yet.' });
    }
    const realScore = (0, scoring_service_1.computeRealScore)(perQuestion.map(p => p.firstAttemptCorrect));
    const result = await ExamResult_1.ExamResult.create({
        studentId: session.studentId,
        setVersion: session.setVersion,
        perQuestion,
        realScore,
        startedAt: session.startedAt,
        completedAt: new Date(),
    });
    await session.deleteOne();
    return res.json({ resultId: result.id, realScore });
}
async function getSummary(req, res) {
    if (!req.user || req.user.role !== 'student')
        return res.status(401).json({ message: 'Unauthorized' });
    const { resultId } = req.params;
    const result = await ExamResult_1.ExamResult.findById(resultId).populate('perQuestion.questionId', 'index');
    if (!result)
        return res.status(404).json({ message: 'Result not found' });
    // Ensure student can only see their own results
    if (String(result.studentId) !== req.user.sub) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    return res.json(result);
}
