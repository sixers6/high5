#!/bin/bash
# Deployment script for High5 backend
npm install
npx serverless deploy --stage prod
