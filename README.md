# ☁️ Serverless Client Portal

A cloud-native web application built on **AWS Free Tier** for managing small business clients.

## 🏗️ Architecture
*   **Frontend**: S3 (Static Web Hosting)
*   **Auth**: Amazon Cognito (User Pools)
*   **Backend**: AWS Lambda (Python 3.12)
*   **API**: API Gateway (REST)
*   **Database**: Amazon DynamoDB (On-Demand / Provisioned)
*   **CI/CD**: GitHub Actions

## 🚀 Features
*   **Secure Auth**: Sign Up, Sign In, Verification via Email.
*   **Dashboard**: View, Add, and Delete Clients.
*   **Serverless**: Zero infrastructure management.
*   **Cost Optimized**: 100% Free Tier compatible.

## 🛠️ Deployment
This project uses **GitHub Actions** for continuous deployment.
Pushing to `master` automatically syncs the `frontend/` folder to the configured S3 bucket.

## 📝 Setup
1.  Create Cognito User Pool.
2.  Create DynamoDB Table (`Clients`, Partition Key: `clientId`).
3.  Deploy Lambda (`backend/lambda_function.py`).
4.  Configure API Gateway (`REST`, Enable CORS).
5.  Update `frontend/auth.js` with Cognito keys.
6.  Update `frontend/app.js` with API URL.
