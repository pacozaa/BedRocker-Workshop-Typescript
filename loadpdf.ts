import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { embedQuery } from "./embedQuery.js";
import { FaissStore } from "langchain/vectorstores/faiss";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { BedrockEmbeddings } from "langchain/embeddings/bedrock";


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
  }
);
// documents in example
const docs = await directoryLoader.load();

// console.log({ docs });

/* Additional steps : Split text into chunks with any TextSplitter. You can then use it as context or save it to memory afterwards. */
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
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

const resultAll = await vectorStore.similaritySearch("Is it possible that I get sentenced to jail due to failure in filings?")
console.log({resultAll});