import { Ollama } from "@langchain/community/llms/ollama";
import { baseUrl, model } from "../constant/modelConfig.js";

export const ollama = new Ollama({
    baseUrl: baseUrl, // Default value
    model: model, // Default value
});

export const getOllamaStream=async (query: string):Promise<string> =>{
    const stream = await ollama.stream(query);

    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(chunk);
    }

    return chunks.join("");
}