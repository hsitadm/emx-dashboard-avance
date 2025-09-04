# 🚀 EMx Dashboard - Deployment Guide

## 📋 Production Deployment

### Prerequisites
- AWS Account with appropriate permissions
- EC2 instance with IAM Role configured
- Cognito User Pool setup
- Domain name (optional)

### 1. IAM Role Configuration
```bash
# Create policy for Cognito access
aws iam create-policy --policy-name EMxDashboard-CognitoReadPolicy --policy-document file://cognito-policy.json

# Attach to existing EC2 role
aws iam attach-role-policy --role-name AmazonSSMRoleForInstancesQuickSetup --policy-arn arn:aws:iam::ACCOUNT:policy/EMxDashboard-CognitoReadPolicy
```

### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/hsitadm/emx-dashboard-avance.git
cd emx-dashboard-avance

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Build frontend
npm run build

# Start services
pm2 start backend/server.js --name emx-backend
```

### 3. Verification
- ✅ Backend running on port 3001
- ✅ Frontend served from backend
- ✅ Cognito authentication working
- ✅ IAM Role providing credentials
- ✅ User management functional

## 🔒 Security Checklist
- [x] IAM Role configured with minimal permissions
- [x] No hardcoded AWS credentials
- [x] HTTPS enabled (recommended)
- [x] CORS properly configured
- [x] Input validation implemented
- [x] Authentication middleware active

## 📊 Monitoring
- CloudWatch logs for application errors
- IAM CloudTrail for API access
- PM2 for process monitoring
- Custom health checks for API endpoints
