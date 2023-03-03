import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Config = {
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET_NAME,
};

const s3Client = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: process.env.S3_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export function getSignedUrlForDownload(key: string) {
  const params = {
    Bucket: s3Config.bucket,
    Key: key,
  };
  const command = new GetObjectCommand(params);
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function checkFileExists(key: string) {
  try {
    const command = new HeadObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (cause) {
    return false;
  }
}

export default s3Client;
