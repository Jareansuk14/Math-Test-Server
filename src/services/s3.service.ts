import AWS from 'aws-sdk';
import { env } from '../config/env';

// Configure AWS with explicit credentials
AWS.config.update({
  accessKeyId: env.awsAccessKeyId,
  secretAccessKey: env.awsSecretAccessKey,
  region: env.awsRegion,
});

const s3 = new AWS.S3({
  region: env.awsRegion,
  accessKeyId: env.awsAccessKeyId,
  secretAccessKey: env.awsSecretAccessKey,
  signatureVersion: 'v4',
});

export function getPresignedUploadUrl(key: string, contentType: string, expiresSeconds = 300) {
  const params = {
    Bucket: env.s3Bucket,
    Key: key,
    Expires: expiresSeconds,
    ContentType: contentType,
  } as const;
  
  console.log('Generating presigned URL with params:', {
    Bucket: env.s3Bucket,
    Key: key,
    Region: env.awsRegion,
    ContentType: contentType,
  });
  
  return s3.getSignedUrl('putObject', params);
}

export function getPresignedViewUrl(key: string, expiresSeconds = 3600) {
  const params = {
    Bucket: env.s3Bucket,
    Key: key,
    Expires: expiresSeconds,
  } as const;
  
  return s3.getSignedUrl('getObject', params);
}
