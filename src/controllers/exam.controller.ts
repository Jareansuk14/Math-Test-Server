import { Request, Response } from 'express';
import { z } from 'zod';
import { startExamSchema, answerSchema } from '../validators/exam.schema';
import { ExamSession } from '../models/ExamSession';
import { ExamResult } from '../models/ExamResult';
import { Question } from '../models/Question';
import { nextHintLevel } from '../services/hint.service';
import { computeRealScore } from '../services/scoring.service';

export async function startExam(req: Request, res: Response) {
  if (!req.user || req.user.role !== 'student') return res.status(401).json({ message: 'Unauthorized' });
  const studentId = req.user.sub;

  const activeQuestion = await Question.findOne().sort({ setVersion: -1 }).lean();
  const setVersion = activeQuestion?.setVersion || 1;

  const existing = await ExamSession.findOne({ studentId, setVersion, status: 'in_progress' });
  if (existing) return res.json({ sessionId: existing.id, setVersion });

  const questions = await Question.find({ setVersion }).sort({ index: 1 }).select('_id').lean();
  const perQuestionProgress = questions.map(q => ({ questionId: q._id, attempts: [] }));
  const session = await ExamSession.create({ studentId, setVersion, perQuestionProgress });
  return res.json({ sessionId: session.id, setVersion });
}

export async function submitAnswer(req: Request, res: Response) {
  if (!req.user || req.user.role !== 'student') return res.status(401).json({ message: 'Unauthorized' });
  const parsed = answerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  const { questionId, choiceIndex } = parsed.data;
  const sessionId = req.params.sessionId;

  const session = await ExamSession.findById(sessionId);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  if (String(session.studentId) !== req.user.sub) return res.status(403).json({ message: 'Forbidden' });

  const q = await Question.findById(questionId);
  if (!q) return res.status(404).json({ message: 'Question not found' });

  const progress = session.perQuestionProgress.find(p => String(p.questionId) === String(questionId));
  if (!progress) return res.status(400).json({ message: 'Question not in session' });

  const isCorrect = choiceIndex === q.correctIndex;
  progress.attempts.push({ choiceIndex, isCorrect, timestamp: new Date() });
  await session.save();

  const wrongAttempts = progress.attempts.filter(a => !a.isCorrect).length;
  const hintLevel = isCorrect ? null : nextHintLevel(wrongAttempts);

  const currentIndex = await Question.countDocuments({ setVersion: q.setVersion, index: { $lte: q.index } });
  const totalQuestions = await Question.countDocuments({ setVersion: q.setVersion });
  const nextIndex = isCorrect ? (currentIndex < totalQuestions ? currentIndex + 1 : null) : currentIndex;

  return res.json({ isCorrect, hintLevel, nextIndex });
}

export async function completeExam(req: Request, res: Response) {
  if (!req.user || req.user.role !== 'student') return res.status(401).json({ message: 'Unauthorized' });
  const sessionId = req.params.sessionId;
  const session = await ExamSession.findById(sessionId);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  if (String(session.studentId) !== req.user.sub) return res.status(403).json({ message: 'Forbidden' });

  // Build results only if all 20 questions have at least one correct attempt
  const questions = await Question.find({ setVersion: session.setVersion }).sort({ index: 1 });

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

  const realScore = computeRealScore(perQuestion.map(p => p.firstAttemptCorrect));
  const result = await ExamResult.create({
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

export async function getSummary(req: Request, res: Response) {
  if (!req.user || req.user.role !== 'student') return res.status(401).json({ message: 'Unauthorized' });
  const { resultId } = req.params;
  const result = await ExamResult.findById(resultId).populate('perQuestion.questionId', 'index choices');
  if (!result) return res.status(404).json({ message: 'Result not found' });
  
  // Ensure student can only see their own results
  if (String(result.studentId) !== req.user.sub) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  return res.json(result);
}
