import { z } from 'zod';

export const startExamSchema = z.object({});

export const answerSchema = z.object({
  questionId: z.string().min(1),
  choiceIndex: z.number().int().min(0).max(3),
});
