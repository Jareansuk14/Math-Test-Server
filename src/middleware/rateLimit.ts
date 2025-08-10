import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const answerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
});
