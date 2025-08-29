#!/bin/bash

echo "🔧 Fixing Node.js version in production..."

# Create new EC2 instance with compatible Node.js
aws cloudformation update-stack \
  --stack-name emx-dashboard-stack \
  --template-body file://cloudformation-template-v2.yaml \
  --parameters ParameterKey=KeyPairName,ParameterValue=emx-dashboard-key \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

echo "✅ New instance will have Node.js 18+ compatible with Vite"
echo "⏳ Wait for stack update to complete, then run your existing deployment"
