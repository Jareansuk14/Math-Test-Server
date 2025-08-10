import { z } from 'zod';

export const hintSchema = z.object({
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  text: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const upsertQuestionSchema = z.object({
  setVersion: z.number().int().min(1),
  index: z.number().int().min(1).max(20),
  promptText: z.string().min(1),
  promptImageUrl: z.string().url().optional(),
  choices: z.array(z.object({ text: z.string().min(1) })).length(4),
  correctIndex: z.number().int().min(0).max(3),
  hints: z.array(hintSchema).length(3),
  firstTryExplanation: z.object({ text: z.string().min(1), imageUrl: z.string().url().optional() }).optional(),
});

export const publishQuestionSetSchema = z.object({
  version: z.number().int().min(1),
  questions: z.array(upsertQuestionSchema.omit({ setVersion: true })).min(1).max(20),
});
