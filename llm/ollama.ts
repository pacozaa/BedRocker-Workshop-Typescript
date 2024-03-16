import { Ollama } from "@langchain/community/llms/ollama";
import { baseUrl } from "../constant/modelConfig.js";
import { OllamaName } from "../constant/modelName.js";

export const ollama = new Ollama({
    baseUrl: baseUrl, // Default value
    model: OllamaName.LLAMA2, // Default value
    maxConcurrency: 5,
});

export const getOllamaStream=async (query: string):Promise<string> =>{
    const stream = await ollama.stream(query);

    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(chunk);
    }

    return chunks.join("");
}