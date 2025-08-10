"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.loginStudent = loginStudent;
exports.loginAdmin = loginAdmin;
exports.logout = logout;
const auth_schema_1 = require("../validators/auth.schema");
const Student_1 = require("../models/Student");
const AdminUser_1 = require("../models/AdminUser");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
async function register(req, res) {
    const parsed = auth_schema_1.registerSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: parsed.error.message });
    const { studentId, name, school } = parsed.data;
    const exists = await Student_1.Student.findOne({ studentId });
    if (exists)
        return res.status(409).json({ message: 'Student already exists' });
    const student = await Student_1.Student.create({ studentId, name, school });
    const token = (0, jwt_1.signToken)({ sub: student.id, role: 'student' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ id: student.id, studentId, name, school });
}
async function loginStudent(req, res) {
    const parsed = auth_schema_1.loginStudentSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: parsed.error.message });
    const { studentId } = parsed.data;
    const student = await Student_1.Student.findOne({ studentId });
    if (!student)
        return res.status(404).json({ message: 'Student not found' });
    const token = (0, jwt_1.signToken)({ sub: student.id, role: 'student' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ id: student.id, studentId: student.studentId, name: student.name, school: student.school });
}
async function loginAdmin(req, res) {
    const parsed = auth_schema_1.adminLoginSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: parsed.error.message });
    const { email, password } = parsed.data;
    const admin = await AdminUser_1.AdminUser.findOne({ email });
    if (!admin)
        return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await (0, password_1.verifyPassword)(password, admin.passwordHash);
    if (!valid)
        return res.status(401).json({ message: 'Invalid credentials' });
    const token = (0, jwt_1.signToken)({ sub: admin.id, role: 'admin' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ id: admin.id, email: admin.email, role: admin.role });
}
async function logout(_req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
}
