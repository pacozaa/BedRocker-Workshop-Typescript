import { OpenAI } from "@langchain/openai";
import { OpenAIName } from "../constant/modelName.js";

export const openAi = new OpenAI({
  modelName: OpenAIName.GPT35Turbo0301, // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
  temperature: 0.9,
//   openAIApiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.OPENAI_API_KEY
});
