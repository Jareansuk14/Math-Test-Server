import { z } from 'zod';

export const registerSchema = z.object({
  studentId: z.string().min(1),
  name: z.string().min(1),
  school: z.string().min(1),
});

export const loginStudentSchema = z.object({
  studentId: z.string().min(1),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
