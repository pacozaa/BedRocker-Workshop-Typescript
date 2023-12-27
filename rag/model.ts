import { Bedrock } from "langchain/llms/bedrock";

export const model = new Bedrock({
    model: "meta.llama2-13b-chat-v1", // You can also do e.g. "anthropic.claude-v2"
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });