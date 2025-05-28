import { Storage } from '@google-cloud/storage';
import path from 'path';

const storage = new Storage({
  keyFilename: path.resolve(__dirname, '../gcp-key.json'),
});

export const uploadToGCP = async (localPath: string, destination: string): Promise<string> => {
  const bucketName = process.env.GCP_BUCKET_NAME;
  if (!bucketName) throw new Error('❌ GCP_BUCKET_NAME is undefined');

  const bucket = storage.bucket(bucketName);
  await bucket.upload(localPath, {
    destination,
    predefinedAcl: 'publicRead',
  });

  return `https://storage.googleapis.com/${bucketName}/${destination}`;
};
