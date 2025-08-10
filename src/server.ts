import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { connectDatabase } from './config/db';
import authRoutes from './routes/auth.routes';
import examRoutes from './routes/exam.routes';
import questionsRoutes from './routes/questions.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

async function bootstrap() {
  await connectDatabase();
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/auth', authRoutes);
  app.use('/exam', examRoutes);
  app.use('/questions', questionsRoutes);
  app.use('/admin', adminRoutes);

  app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
