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
// documents in example
const docs = await directoryLoader.load();

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
  Write a list of topics in this meeting transcription:


"{text}"


List of Topics in bullet points format:`
);
const chain = loadSummarizationChain(model, { type: "map_reduce", combineMapPrompt: promptTemplate })

const res = await chain.call({
    input_documents: splitDocs,
});
console.log({ res });