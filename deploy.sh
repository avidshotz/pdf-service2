#!/bin/bash
# Deployment script for Vercel using API token
# Set your VERCEL_TOKEN environment variable before running this script

if [ -z "$VERCEL_TOKEN" ]; then
    echo "Error: VERCEL_TOKEN environment variable is not set"
    echo "Please set it with: export VERCEL_TOKEN=your_token_here"
    exit 1
fi

echo "Deploying to Vercel with API token..."
npx vercel --token "$VERCEL_TOKEN" --prod --yes

echo "Deployment complete!"
