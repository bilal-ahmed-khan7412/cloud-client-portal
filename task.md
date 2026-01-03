# Project Roadmap: Cloud-Native Business Portal

## Phase 0: Planning & Setup
- [x] Define Scope
- [x] Choose Tech Stack
- [ ] AWS Account Safety (MFA, Budget)

## Phase 1: Frontend (S3 Static Site)
- [x] Create local frontend files
- [x] Create S3 Bucket (Name: client-portal-<yourname>)
- [x] Disable Block Public Access
- [x] Enable Static Website Hosting
- [x] Upload frontend files to S3
- [x] Verify Website URL

## Phase 2: Authentication (Cognito)
- [x] Create User Pool in Cognito
- [x] Create App Client
- [x] Configure Hosted UI (Optional) or Custom UI
- [x] Integrate Cognito with Frontend

## Phase 3: Backend (Lambda + API Gateway)
- [x] Create Lambda Function (Python)
- [x] Create API Gateway (REST API)
- [x] Connect API Gateway to Lambda
- [x] Test API from Frontend

## Phase 5: Interview Prep & Documentation
- [/] Verify Data in DynamoDB
- [/] Create Interview Q&A Sheet
- [x] Create DynamoDB Table (Clients)
- [ ] Create DynamoDB Table (Tasks)
- [x] Update Lambda to read/write to DynamoDB

## Phase 5: IAM & Security
- [ ] Restrict Lambda Permissions (Least Privilege)
- [ ] Enable Encryption

## Phase 6: Monitoring & Cost Control
- [ ] Setup CloudWatch Logs
- [ ] Setup AWS Budgets

## Phase 7: CI/CD (GitHub Actions)
- [ ] Create GitHub Repository
- [ ] Configure GitHub Actions Workflow
- [ ] Automate S3 Deployment
- [ ] Automate SAM Deployment

## Phase 8: Documentation & Resume
- [ ] Create Arch Diagram
- [ ] Write README.md

## Phase 6 (New): Automate Deployment (CI/CD)
- [x] Initialize Local Git Repo
- [x] Create GitHub Actions Workflow
- [x] Create GitHub Repository
- [x] Push Code to GitHub
- [/] Configure GitHub Secrets (AWS Keys)
