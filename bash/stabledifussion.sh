#!/bin/bash
aws bedrock-runtime invoke-model \
--model-id stability.stable-diffusion-xl-v0 \
--body "{\"text_prompts\":\
[{\"text\":\"Bedrock, Titan, masterpiece, figure\",\"weight\":1}] \
,\"cfg_scale\":10,\"seed\":0,\"steps\":30,\"width\":512,\"height\":768}" \
--cli-binary-format raw-in-base64-out \
--region us-east-1 \
$HOME/image-invoke-model-output.txt

jq -r .artifacts[0].base64 $HOME/image-invoke-model-output.txt | base64 -d > $HOME/stabeld.png