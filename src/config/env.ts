import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/math-test',
  jwtSecret: process.env.JWT_SECRET || 'change_me_in_env',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  awsRegion: process.env.AWS_REGION || '',
  s3Bucket: process.env.AWS_S3_BUCKET || '',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
};
