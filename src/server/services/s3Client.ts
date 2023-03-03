import { S3Client } from '@aws-sdk/client-s3';
import { env } from '../env';

const s3Client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export default s3Client;
