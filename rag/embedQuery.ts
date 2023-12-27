import { BedrockEmbeddings } from "langchain/embeddings/bedrock";



export const embedQuery = async (textQuery: string) => {
    console.log({ textQuery })
    const embeddings = new BedrockEmbeddings({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        model: "amazon.titan-embed-text-v1",
    });

    // Embed a query and log the result
    const res = await embeddings.embedQuery(textQuery);
    // console.log({ res })
    return res;
}