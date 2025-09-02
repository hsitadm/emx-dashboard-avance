#!/bin/bash

# EMx Dashboard AWS Deployment Script
# Version: 1.1.0

set -e

STACK_NAME="emx-dashboard-prod"
REGION="us-east-1"
KEY_PAIR_NAME="emx-dashboard-key"

echo "🚀 Starting AWS Deployment for EMx Dashboard v1.1.0..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured or credentials expired"
    echo "Please run: aws configure"
    exit 1
fi

# Create key pair if it doesn't exist
if ! aws ec2 describe-key-pairs --key-names $KEY_PAIR_NAME --region $REGION > /dev/null 2>&1; then
    echo "🔑 Creating EC2 Key Pair..."
    aws ec2 create-key-pair \
        --key-name $KEY_PAIR_NAME \
        --region $REGION \
        --query 'KeyMaterial' \
        --output text > ${KEY_PAIR_NAME}.pem
    chmod 400 ${KEY_PAIR_NAME}.pem
    echo "✅ Key pair created: ${KEY_PAIR_NAME}.pem"
else
    echo "✅ Key pair already exists: $KEY_PAIR_NAME"
fi

# Deploy CloudFormation stack
echo "☁️ Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file aws-deploy.yml \
    --stack-name $STACK_NAME \
    --parameter-overrides KeyPairName=$KEY_PAIR_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION

# Get stack outputs
echo "📊 Getting deployment information..."
PUBLIC_IP=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`PublicIP`].OutputValue' \
    --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)

echo ""
echo "🎉 AWS Deployment Complete!"
echo "================================"
echo "📍 Public IP: $PUBLIC_IP"
echo "🌐 Website URL: $WEBSITE_URL"
echo "🔑 SSH Command: ssh -i ${KEY_PAIR_NAME}.pem ec2-user@$PUBLIC_IP"
echo ""
echo "⏳ Please wait 5-10 minutes for the application to fully initialize..."
echo "📋 Check deployment status: ssh -i ${KEY_PAIR_NAME}.pem ec2-user@$PUBLIC_IP 'pm2 status'"
echo ""
echo "🚀 EMx Dashboard v1.1.0 is now live on AWS!"
