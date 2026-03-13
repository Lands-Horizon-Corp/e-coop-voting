import { Readable } from "stream";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

import { TFolderUploadGroups } from "@/types";
import s3Client, { getS3BaseURL } from "@/lib/aws-s3";

export const uploadFile = async (
    file: Buffer | Readable,
    fileName: string,
    folder: TFolderUploadGroups,
    type?: string,
) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `/${folder}/${fileName}`,
        Body: file, // Directly use file (Buffer or Readable stream)
        ContentType: type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return new URL(params.Key, getS3BaseURL()).href;
};
