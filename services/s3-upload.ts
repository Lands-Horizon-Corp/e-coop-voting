import { Readable } from "stream";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

import { TFolderUploadGroups } from "@/types";
import s3Client, { getS3BaseURL } from "@/lib/aws-s3";

export const uploadFile = async (
  file: Buffer | Readable,
  originalFileName: string,
  folder: TFolderUploadGroups,
  type?: string,
) => {
  const extension = path.extname(originalFileName);
  const uniqueId = randomUUID();
  const shardedPath = `${uniqueId.substring(0, 2)}/${uniqueId.substring(2, 4)}`;
  const finalKey = `${folder}/${shardedPath}/${uniqueId}${extension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: finalKey,
    Body: file,
    ContentType: type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return new URL(params.Key, getS3BaseURL()).href;
};
