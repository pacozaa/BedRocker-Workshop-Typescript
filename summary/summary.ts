import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { bedrock } from "../llm/bedrock.js";
import { ollama } from "../llm/ollama.js";
import { loadSummarizationChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

const model = bedrock
const model2 = ollama

const directoryLoader = new DirectoryLoader(
    "./data",
    {
        ".txt": (path: string) => new TextLoader(path)
    }
);

// const loader = new TextLoader("./data/sample.txt");

// const docs = await loader.load();
// documents in example
const docs = await directoryLoader.load();
console.log({ docslen: docs.length })

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 4000,
    chunkOverlap: 100,
    separators: ["\n\n", "\n"]
});
//docs in example
const splitDocs = await textSplitter.splitDocuments(docs);

const avgDocLength = (documents: Document[]): number => {
    return documents.reduce((sum, doc) => sum + doc.pageContent.length, 0) / documents.length;
};
const avgCharCountPre = avgDocLength(docs);
const avgCharCountPost = avgDocLength(splitDocs);

console.log(`Average length among ${docs.length} documents loaded is ${avgCharCountPre} characters.`);
console.log(`After the split we have ${splitDocs.length} documents more than the original ${docs.length}.`);
console.log(`Average length among ${docs.length} documents (after split) is ${avgCharCountPost} characters.`);

console.log({ pageContent0: await model.getNumTokens(splitDocs[0].pageContent) })
console.log({ metadata0: splitDocs[0].metadata })

const promptTemplate = PromptTemplate.fromTemplate(`
[Instruction] Write a list of topics in this meeting transcription in Markdown bullet points format[/Instruction]

<transcription>
"{text}"
</transcription>

List of Topics in Markdown bullet points format:`);

/**
 * 
 * combineMapPrompt is the prompt that we summarized each chunk piece
 * combinePrompt is the prompt that we combine summarized piece together
 * More Info 
 * https://github.com/langchain-ai/langchainjs/blob/11a617d7bc5fe6216f71625213d35354dbf9df75/langchain/src/chains/summarization/load.ts
 * Hence if you want to use Claude 2.1, 
 * you have to modify both combinePrompt, combineMapPrompt because it has its own prompt format aka \n\nHuman:{prompt}\n\nAssistant:
 * 
 * 
*/

const chain = loadSummarizationChain(model, { type: "map_reduce", combinePrompt: promptTemplate, verbose: true, returnIntermediateSteps: true, })

const res = await chain.call({
    input_documents: splitDocs,
});
console.log({ res });