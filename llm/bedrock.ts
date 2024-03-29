import { Bedrock } from "langchain/llms/bedrock";
import { BedrockModelName } from "../constant/modelName.js";

export const bedrock = new Bedrock({
  model: BedrockModelName.LLAMA2_13B_CHAT_V1, // You can also do e.g. "anthropic.claude-v2"
  region: "us-east-1",
  maxTokens: 2048,
  maxConcurrency:5,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});