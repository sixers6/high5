# High5 Deployment Guide

This guide provides instructions for deploying the High5 application, which consists of a Next.js frontend and an AWS serverless backend.

## Prerequisites

Before deploying the High5 application, ensure you have the following:

1. **GitHub Account**: For hosting the frontend code and enabling GitHub Pages deployment
2. **AWS Account**: For deploying the serverless backend
3. **Node.js and npm**: Version 18.x or higher
4. **AWS CLI**: Configured with appropriate credentials
5. **Serverless Framework**: For deploying the backend to AWS

## Frontend Deployment (GitHub Pages)

The High5 frontend is a Next.js application that can be deployed to GitHub Pages using GitHub Actions.

### Step 1: Create a GitHub Repository

1. Create a new repository on GitHub
2. Initialize the repository with a README file

### Step 2: Push the Frontend Code to GitHub

```bash
# Clone your new repository
git clone https://github.com/yourusername/high5.git
cd high5

# Copy the frontend code to the repository
cp -r /path/to/High5/frontend/* .

# Add, commit, and push the code
git add .
git commit -m "Initial commit of High5 frontend"
git push origin main
```

### Step 3: Configure GitHub Secrets

For GitHub Actions to deploy to GitHub Pages, you need to configure the following secrets:

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `GH_PAGES_TOKEN`: A personal access token with the `repo` scope

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to Settings > Pages
3. Set the source to "GitHub Actions"

The GitHub workflow file (`.github/workflows/deploy.yml`) will automatically build and deploy the frontend to GitHub Pages whenever changes are pushed to the main branch.

## Backend Deployment (AWS Serverless)

The High5 backend is an AWS serverless application that uses Lambda functions, API Gateway, and DynamoDB.

### Step 1: Configure AWS Credentials

Ensure your AWS CLI is configured with the appropriate credentials:

```bash
aws configure
```

### Step 2: Deploy the Backend

```bash
# Navigate to the backend directory
cd /path/to/High5/backend

# Install dependencies
npm install

# Deploy to AWS
npx serverless deploy --stage prod
```

### Step 3: Configure GitHub Secrets for Backend Deployment

If you want to use GitHub Actions to deploy the backend, configure the following secrets:

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

### Step 4: Update API Endpoint in Frontend

After deploying the backend, you'll receive an API Gateway endpoint URL. Update this URL in the frontend:

1. Edit the `.env.production` file in the frontend directory
2. Update the `NEXT_PUBLIC_API_BASE_URL` variable with your API Gateway endpoint URL
3. Rebuild and redeploy the frontend

## Connecting Frontend and Backend

To ensure the frontend can communicate with the backend:

1. Enable CORS in the API Gateway:
   - This is configured in the `serverless.yml` file with the `cors: true` setting

2. Update the API endpoint in the frontend:
   - Edit the `.env.production` file
   - Set `NEXT_PUBLIC_API_BASE_URL` to your API Gateway endpoint

## Verifying the Deployment

### Frontend Verification

1. Navigate to your GitHub Pages URL (typically `https://yourusername.github.io/high5`)
2. Verify that the UI loads correctly
3. Test the chat interface and other UI components

### Backend Verification

1. Test the API endpoints using a tool like Postman or curl:
   ```bash
   curl -X POST https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod/agent/process \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello", "conversationId": "test-conversation"}'
   ```

2. Check the AWS CloudWatch logs for any errors

## Troubleshooting

### Common Frontend Issues

1. **Blank Page**: Check browser console for errors, ensure API endpoint is correct
2. **API Connection Errors**: Verify CORS settings, check API endpoint URL

### Common Backend Issues

1. **Deployment Failures**: Check AWS IAM permissions, verify serverless.yml configuration
2. **Lambda Errors**: Check CloudWatch logs for detailed error messages
3. **API Gateway Issues**: Verify endpoint configuration, check CORS settings

## Maintenance and Updates

### Updating the Frontend

1. Make changes to the frontend code
2. Push changes to the GitHub repository
3. GitHub Actions will automatically build and deploy the changes

### Updating the Backend

1. Make changes to the backend code
2. Deploy the changes using the Serverless Framework:
   ```bash
   npx serverless deploy --stage prod
   ```

## Security Considerations

1. **API Keys**: Consider implementing API key authentication for your API Gateway
2. **User Authentication**: Add user authentication using services like AWS Cognito
3. **Environment Variables**: Ensure sensitive information is stored in environment variables or AWS Parameter Store
4. **IAM Permissions**: Follow the principle of least privilege for Lambda function IAM roles

## Cost Optimization

1. **Lambda Provisioned Concurrency**: Consider using provisioned concurrency for production workloads
2. **DynamoDB Capacity**: Monitor and adjust DynamoDB capacity based on usage patterns
3. **CloudWatch Logs**: Set appropriate retention periods for CloudWatch logs

## Conclusion

You have successfully deployed the High5 application with a Next.js frontend on GitHub Pages and an AWS serverless backend. The application provides a Manus-like UI with an agentic backend that can dynamically generate interactive web UI elements.
