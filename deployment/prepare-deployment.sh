#!/bin/bash

# Deployment script for High5 application
# This script prepares the deployment package for the High5 application

echo "Preparing High5 deployment package..."

# Create deployment directory
mkdir -p /home/ubuntu/High5/deployment

# Prepare frontend for deployment
echo "Preparing frontend for deployment..."
cd /home/ubuntu/High5/frontend

# Create .env.production file
cat > .env.production << 'EOL'
# Production environment variables
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
EOL

# Create build script
cat > build.sh << 'EOL'
#!/bin/bash
# Build script for High5 frontend
npm install
npm run build
EOL
chmod +x build.sh

# Create GitHub workflow file for frontend deployment
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOL'
name: Deploy High5 Frontend

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: out
EOL

# Prepare backend for deployment
echo "Preparing backend for deployment..."
cd /home/ubuntu/High5/backend

# Create deployment script
cat > deploy.sh << 'EOL'
#!/bin/bash
# Deployment script for High5 backend
npm install
npx serverless deploy --stage prod
EOL
chmod +x deploy.sh

# Create GitHub workflow file for backend deployment
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOL'
name: Deploy High5 Backend

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Deploy to AWS
        run: npx serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
EOL

# Create deployment package
echo "Creating deployment package..."
cd /home/ubuntu/High5

# Create .gitignore file
cat > .gitignore << 'EOL'
# Node.js
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log

# Next.js
.next/
out/

# Build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Serverless
.serverless/

# AWS
.aws-sam/

# Misc
.DS_Store
*.pem
.vscode/
.idea/
*.log
EOL

# Create package script
cat > package.sh << 'EOL'
#!/bin/bash
# Package script for High5 application
zip -r high5-deployment.zip . -x "node_modules/*" ".next/*" ".serverless/*" "*.git*"
EOL
chmod +x package.sh

echo "Deployment package preparation completed!"
