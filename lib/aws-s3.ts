import { S3Client } from "@aws-sdk/client-s3";
import { TFolderGroupSchema } from "@/validation-schema/upload";

const S3_REGION = process.env.AWS_S3_REGION;
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const S3_ACCESSKEY_ID = process.env.AWS_S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_ACCESSKEY_ID ?? "",
        secretAccessKey: S3_SECRET_ACCESS_KEY ?? "",
    },
});

export const getS3BaseURL = (
    bucketName: TFolderGroupSchema = "" as TFolderGroupSchema
) => {
    const buildUrl = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${bucketName}`;
    return buildUrl;
};

export const generateUserProfileS3URL = (pbNumber: string) => {
    return `${getS3BaseURL("member")}/${pbNumber}.webp`;
};

export default s3Client;
