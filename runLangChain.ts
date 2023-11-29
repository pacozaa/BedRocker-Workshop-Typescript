import { BedrockEmbeddings } from "langchain/embeddings/bedrock";

const embeddings = new BedrockEmbeddings({
    region: "us-east-1",
    model: "amazon.titan-embed-text-v1",
  });
  
  // Embed a query and log the result
const res = await embeddings.embedQuery(
  "What would be a good company name for a company that makes colorful socks?"
);
console.log({ res });