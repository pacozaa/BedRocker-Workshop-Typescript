
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// a client can be shared by different commands.
const client = new BedrockRuntimeClient({ region: "us-east-1" });

const params = {
    // modelId: "meta.llama2-13b-chat-v1",
    modelId: "amazon.titan-embed-text-v1",
    body: "{\"prompt\":\"Hi what time is it in BKK\",\"max_gen_len\":512,\"temperature\":0.5,\"top_p\":0.9}",
    contentType: 'application/json',
    accept: '*/*',
  };
const command = new InvokeModelCommand(params);

// async/await.
try {
const response = await client.send(command);
// Save the raw response
const rawRes = response.body;

// Convert it to a JSON String
const jsonString = new TextDecoder().decode(rawRes);

// Parse the JSON string
const parsedResponse = JSON.parse(jsonString);

console.log("-------------------------");
console.log("---Pased Response Body---");
console.log("-------------------------");
console.log(parsedResponse);
console.log("-------------------------");
console.log("-------------------------");
console.log("----Completion Result----");
console.log("-------------------------");
// Answers are in parsedResponse.completions[0].data.text
console.log(parsedResponse.generation);
console.log("-------------------------");
  // process data.
} catch (error) {
  // error handling.
//   const { requestId, cfId, extendedRequestId } = error?.$metadata;
  console.log({ error });
}