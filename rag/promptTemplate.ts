import { PromptTemplate } from "langchain/prompts";

const promptTemplate = `Human: Use the following pieces of context to provide a concise answer to the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
<context>
{context}
</context

Question: {question}

Assistant:"`
// If a template is passed in, the input variables are inferred automatically from the template.
export const prompt = PromptTemplate.fromTemplate(promptTemplate);

// const formattedPrompt = await prompt.format({
//   product: "colorful socks",
// });