import { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand, RetrieveCommand } from "@aws-sdk/client-bedrock-agent-runtime";


const client = new BedrockAgentRuntimeClient({ region: "us-east-1" });

const retrieveAndGen = await new RetrieveAndGenerateCommand({
  input: { text: "Is today publich holiday?" },
  retrieveAndGenerateConfiguration: {
    type: "KNOWLEDGE_BASE",
    knowledgeBaseConfiguration: {
      knowledgeBaseId: "ID",
      modelArn: "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2",
    }
  }
})

const {citations, output} = await client.send(retrieveAndGen);
console.log({citations, output})

// const retrieve = await new RetrieveCommand({
//   knowledgeBaseId: "ID",
//   retrievalQuery: { text: "rules" }
// })

// citations?.map(citation=>{
//   console.log(citation.generatedResponsePart)
//   citation.retrievedReferences?.map(ref=>{
//     console.log(ref.content, ref.location)
//   })
// })

// response.retrievalResults?.map(output=>{
//   const {content, location, score}=output
//   const {text} = content?content:{text: ''}
//   console.log({text})
// })