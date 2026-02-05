import { S3Client } from "@aws-sdk/client-s3";

const S3_REGION = process.env.AWS_S3_REGION || "auto";
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const S3_ACCESSKEY_ID = process.env.AWS_S3_ACCESS_KEY_ID!;
const S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY!;
const S3_ENDPOINT = process.env.AWS_S3_ENDPOINT!;

/**
 * S3 client for Tigris
 * IMPORTANT:
 * - forcePathStyle MUST be true
 * - NO ACLs (Tigris does not support them)
 */
const s3Client = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESSKEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

/**
 * Base public URL for files
 * Format:
 * https://t3.storageapi.dev/<bucket>/<folder>
 */
export const getS3BaseURL = (folder: string = "") => {
  return `${S3_ENDPOINT}/${S3_BUCKET_NAME}${folder ? `/${folder}` : ""}`;
};

/**
 * Helper for user profile images
 */
export const generateUserProfileS3URL = (pbNumber: string) => {
  return `${getS3BaseURL("member")}/${pbNumber}.webp`;
};

export default s3Client;
