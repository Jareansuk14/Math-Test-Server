import { Request, Response } from 'express';
import { Question } from '../models/Question';

export async function getActiveQuestions(_req: Request, res: Response) {
  const q = await Question.findOne().sort({ setVersion: -1 }).lean();
  const setVersion = q?.setVersion || 1;
  const items = await Question.find({ setVersion }).sort({ index: 1 }).lean();
  return res.json({ setVersion, items });
}
