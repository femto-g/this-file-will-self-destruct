import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import {
  createFile,
  decrementDownloads,
  readFile,
} from "../data/repositories/fileRepository";
import { enqueueFileDeletion } from "./sqs";

interface S3ClientParams {
  region: string | undefined;
  bucket: string | undefined;
  key: string | undefined;
}

interface S3UploadUrlParams {
  extension: string | undefined;
}

interface uploadData {
  url: string;
  key: string;
}

interface S3DownloadURLParams {
  key: string | undefined;
}
const createUploadUrl = ({ region, bucket, key }: S3ClientParams) => {
  const client = new S3Client({ region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 30 });
};

const createDownloadUrl = ({ region, bucket, key }: S3ClientParams) => {
  const client = new S3Client({ region });
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 30 });
};
export async function getUploadURL({
  extension,
}: S3UploadUrlParams): Promise<uploadData> {
  const REGION = process.env.S3_REGION;
  const BUCKET = process.env.S3_BUCKET;
  const KEY = randomUUID() + "." + extension;

  const clientUrl = await createUploadUrl({
    region: REGION,
    bucket: BUCKET,
    key: KEY,
  });

  await createFile(KEY);

  return { url: clientUrl, key: KEY };
}

export async function getDownloadUrl({ key }: S3DownloadURLParams) {
  console.log("about to read file ");
  const file = await readFile(key!);
  console.log(`read file ${JSON.stringify(file)}`);
  if (!file || file.remaining_downloads == 0) {
    return null;
  }

  console.log("read file ");

  const REGION = process.env.S3_REGION;
  const BUCKET = process.env.S3_BUCKET;
  const KEY = key;

  const url = await createDownloadUrl({
    region: REGION,
    bucket: BUCKET,
    key: KEY,
  });

  console.log("got download url");

  const remainingDownloads = await decrementDownloads(key!);

  console.log("decremented downloads");
  if (remainingDownloads == 0) {
    await enqueueFileDeletion(key!);
    console.log("enqueudfiledeletion");
  }
  return { url };
}
