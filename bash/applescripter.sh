#!/bin/bash

read -p "Enter command: " input
prompt="\n\nHuman: Claude, please analyze the action input text: '$input' which the user would like to perform on macos, \
and provide only the text that would fit directly into an osascript -e command to perform this action input text. \
DO NOT INCLUDE osascript -e itself and DO NOT return whitespace in front of the answer and DO NOT RETURN new line \
DO NOT add string escape for slash or double qoute or single qoute at all \
\n\nAssistant:"
response=$(aws bedrock-runtime invoke-model \
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