import { S3Client } from "@aws-sdk/client-s3";
import { TFolderGroupSchema } from "@/validation-schema/upload";

const S3_REGION = process.env.AWS_S3_REGION || "auto";
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const S3_ACCESSKEY_ID = process.env.AWS_S3_ACCESS_KEY_ID!;
const S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY!;
const S3_ENDPOINT = process.env.AWS_S3_ENDPOINT!;

const s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESSKEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});

export const getS3BaseURL = (
    folder: TFolderGroupSchema | "" = ""
) => {
    const cleanEndpoint = S3_ENDPOINT.replace(/^https?:\/\//, "");

    return `https://${S3_BUCKET_NAME}.${cleanEndpoint}/${folder}`;
};

export const generateUserProfileS3URL = (pbNumber: string) => {
    return `${getS3BaseURL("member")}/${pbNumber}.webp`;
};

export default s3Client;
