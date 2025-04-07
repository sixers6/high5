# High5 GitHub Repository

This repository contains the High5 application, a Manus-like UI with an agentic backend using serverless architecture.

## Overview

High5 is a web application that features:
- A responsive Next.js frontend with a chat interface
- An AWS serverless backend with Lambda functions
- Dynamic UI generation capabilities
- Agentic behavior for interactive experiences

## Repository Structure

- `frontend/` - Next.js frontend application
- `backend/` - AWS serverless backend application
- `docs/` - Documentation and deployment instructions
- `tests/` - Test files and scripts
- `deployment/` - Deployment scripts and configuration

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- AWS account (for backend deployment)
- GitHub account (for frontend deployment)

### Local Development

1. Clone this repository
2. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Set up the backend:
```bash
cd backend
npm install
npx serverless offline
```

## Deployment

See the [Deployment Guide](./docs/deployment-guide.md) for detailed instructions on deploying the application to GitHub Pages and AWS.

## Features

- **Chat Interface**: Interactive chat UI similar to Manus
- **Dynamic UI Generation**: Server-side generation of UI components
- **Agentic Backend**: Intelligent processing of user requests
- **Responsive Design**: Works on desktop and mobile devices

## License

MIT
