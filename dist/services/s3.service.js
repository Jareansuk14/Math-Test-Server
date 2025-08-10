"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedUploadUrl = getPresignedUploadUrl;
exports.getPresignedViewUrl = getPresignedViewUrl;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const env_1 = require("../config/env");
// Configure AWS with explicit credentials
aws_sdk_1.default.config.update({
    accessKeyId: env_1.env.awsAccessKeyId,
    secretAccessKey: env_1.env.awsSecretAccessKey,
    region: env_1.env.awsRegion,
});
const s3 = new aws_sdk_1.default.S3({
    region: env_1.env.awsRegion,
    accessKeyId: env_1.env.awsAccessKeyId,
    secretAccessKey: env_1.env.awsSecretAccessKey,
    signatureVersion: 'v4',
});
function getPresignedUploadUrl(key, contentType, expiresSeconds = 300) {
    const params = {
        Bucket: env_1.env.s3Bucket,
        Key: key,
        Expires: expiresSeconds,
        ContentType: contentType,
    };
    console.log('Generating presigned URL with params:', {
        Bucket: env_1.env.s3Bucket,
        Key: key,
        Region: env_1.env.awsRegion,
        ContentType: contentType,
    });
    return s3.getSignedUrl('putObject', params);
}
function getPresignedViewUrl(key, expiresSeconds = 3600) {
    const params = {
        Bucket: env_1.env.s3Bucket,
        Key: key,
        Expires: expiresSeconds,
    };
    return s3.getSignedUrl('getObject', params);
}
