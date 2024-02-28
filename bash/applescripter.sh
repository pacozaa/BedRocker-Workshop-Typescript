#!/bin/bash

function invoke_model() {
  aws bedrock-runtime invoke-model \
    --model-id anthropic.claude-v2 \
    --region us-east-1 \
    --body "{\"prompt\": \"$prompt\", \"max_tokens_to_sample\" : 300, \"temperature\": 0.1}" \
    --cli-binary-format raw-in-base64-out \
    invoke-model-output.txt
}

read -p "Enter command: " command_input

prompt_human=$(cat <<EOF
\n\nHuman: Claude, please analyze the action input text: '$command_input' which the user would like to perform on macos,
and provide only the text that would fit directly into an osascript -e command to perform this action input text. 
DO NOT INCLUDE osascript -e itself and DO NOT return whitespace in front of the answer and DO NOT RETURN new line 
DO NOT add string escape for slash or double qoute or single qoute at all 
EOF
)

prompt="$(printf "%s\n\nAssistant:" "$prompt_human")"
aws_response=$(aws bedrock-runtime invoke-model \
    --model-id anthropic.claude-v2 \
    --region us-east-1 \
    --body "{\"prompt\": \"$prompt\", \"max_tokens_to_sample\" : 300, \"temperature\": 0.1}" \
    --cli-binary-format raw-in-base64-out \
    invoke-model-output.txt)

extractCMD=$(cat invoke-model-output.txt | jq -r .completion)
echo "Extact cmd ${extractCMD}"
echo ${extractCMD} > extractCMD.applescript

osascript -e "${extractCMD}"
# osascript extractCMD.applescript // without -e, read from file instead