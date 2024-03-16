import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { JSONLoader } from "langchain/document_loaders/fs/json.js"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { bedrock } from "../llm/bedrock.js";
import { ollama } from "../llm/ollama.js";
import { loadSummarizationChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const model = bedrock
// const model2 = ollama

// const directoryLoader = new DirectoryLoader(
//     "./data",
//     {
//         ".txt": (path: string) => new TextLoader(path)
//     }
// );
// const docs = await directoryLoader.load();

const loader = new TextLoader("./data/finance-meeting.txt");

const docs = await loader.load();
// documents in example

console.log({ docslen: docs.length })

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 100,
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

List of Topics in Markdown bullet points format and identify which one is action item with label [Action]:`);

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

const chain = loadSummarizationChain(model, { combinePrompt: promptTemplate, type: "map_reduce", verbose: true, returnIntermediateSteps: true, })

try {
    const res = await chain.invoke({
        input_documents: splitDocs,
        // timeout: 300000,

    }, { maxConcurrency: 5, });
    console.log({ resText: res.text });

    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    fs.writeFile(path.join(__dirname, '..', '..', 'data', 'sumNow.md'), res.text, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File written successfully!');
    });
} catch (e) {
    console.log(e);
}
