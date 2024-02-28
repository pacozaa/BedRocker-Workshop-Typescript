import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { embedQuery } from "./embedQuery.js";
import { FaissStore } from "langchain/vectorstores/faiss";
import { BedrockEmbeddings } from "langchain/embeddings/bedrock";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { prompt } from "./promptTemplate.js";
import { bedrock } from "../llm/bedrock.js";

const bedRockConfig = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  model: "amazon.titan-embed-text-v1",
}
/* Load all PDFs within the specified directory */
const directoryLoader = new DirectoryLoader(
  "./data",
  {
    ".pdf": (path: string) => new PDFLoader(path),
    ".json": (path: string) => new JSONLoader(path)
  }
);
// documents in example
const docs = await directoryLoader.load();

// console.log({ docs });

/* Additional steps : Split text into chunks with any TextSplitter. You can then use it as context or save it to memory afterwards. */
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 5000,
  chunkOverlap: 100,
});
//docs in example
const splitDocs = await textSplitter.splitDocuments(docs);
// console.log({ splitDocs });

const avgDocLength = (documents: Document[]): number => {
  return documents.reduce((sum, doc) => sum + doc.pageContent.length, 0) / documents.length;
};
const avgCharCountPre = avgDocLength(docs);
const avgCharCountPost = avgDocLength(splitDocs);

console.log(`Average length among ${docs.length} documents loaded is ${avgCharCountPre} characters.`);
console.log(`After the split we have ${splitDocs.length} documents more than the original ${docs.length}.`);
console.log(`Average length among ${docs.length} documents (after split) is ${avgCharCountPost} characters.`);

// console.log(splitDocs[0].pageContent);

const sampleEmbedding: number[] = await embedQuery(splitDocs[0].pageContent)
console.log("Sample embedding of a document chunk: ", sampleEmbedding);
console.log("Size of the embedding: ", sampleEmbedding.length);

const vectorStore = await FaissStore.fromDocuments(splitDocs, new BedrockEmbeddings(bedRockConfig));
//"What are Palo IT Thailand's rules and regulations?"
//"What are Palo IT Thailand working hours?"
//"How many holiday of Palo IT Thailand in 2024?"
//"Summarize Strategy Roadmap 2024 please?"
//"I am new, how can I reimburse the expense?"
//What are Palo IT onboarding process?
// What are Palo IT tech stack and technical standard?
//What are feedback giving methodology in Palo IT?
//What are the list of customers of Palo IT Thailand
// Today is 26 Jan 2024, When is Palo next holiday?
const query = "Today is 26 Jan 2024, When is Palo next holiday?"// Hey I want to book golf course 26 FEb...
// For example .... 15 slot abcd, i want you to answer with the closest slot...
// i want this slot
// give me this infomation
const resultAll = await vectorStore.similaritySearch(query,3)
console.log({ resultAll });

const chain = new RetrievalQAChain({
  combineDocumentsChain: loadQAStuffChain(bedrock,{prompt}),
  retriever: vectorStore.asRetriever(2),
  returnSourceDocuments: true
})

const res = await chain.call({query});
console.log({ res });