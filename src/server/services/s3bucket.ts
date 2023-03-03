import s3Client from './s3Client';
import { env } from '../env';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export function getSignedUrlForUpload(key: string) {
  const params = {
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  };

  const command = new PutObjectCommand(params);
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function deleteFile(key: string) {
  const params = {
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  };
  const command = new DeleteObjectCommand(params);
  return s3Client.send(command);
}
