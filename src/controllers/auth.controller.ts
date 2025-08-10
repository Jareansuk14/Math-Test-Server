import { Request, Response } from 'express';
import { z } from 'zod';
import { registerSchema, loginStudentSchema, adminLoginSchema } from '../validators/auth.schema';
import { Student } from '../models/Student';
import { AdminUser } from '../models/AdminUser';
import { hashPassword, verifyPassword } from '../utils/password';
import { signToken } from '../utils/jwt';

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  const { studentId, name, school } = parsed.data;
  const exists = await Student.findOne({ studentId });
  if (exists) return res.status(409).json({ message: 'Student already exists' });
  const student = await Student.create({ studentId, name, school });
  const token = signToken({ sub: student.id, role: 'student' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

  return res.json({ id: student.id, studentId, name, school });
}

export async function loginStudent(req: Request, res: Response) {
  const parsed = loginStudentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  const { studentId } = parsed.data;
  const student = await Student.findOne({ studentId });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const token = signToken({ sub: student.id, role: 'student' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ id: student.id, studentId: student.studentId, name: student.name, school: student.school });
}

export async function loginAdmin(req: Request, res: Response) {
  const parsed = adminLoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  const { email, password } = parsed.data;
  const admin = await AdminUser.findOne({ email });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ sub: admin.id, role: 'admin' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ id: admin.id, email: admin.email, role: admin.role });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}
