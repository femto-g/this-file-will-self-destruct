import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new SQSClient({
  region: process.env.S3_REGION,
});
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

async function sendMessage(message: object) {
  const messageString = JSON.stringify(message);

  const command = new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    DelaySeconds: 10,
    MessageBody: messageString,
  });

  const response = await client.send(command);
  console.log(response);
  return response;
}

export async function enqueueFileDeletion(key: string) {
  const message = {
    key: key,
    action: "delete",
  };

  console.log(message);

  sendMessage(message);
}
