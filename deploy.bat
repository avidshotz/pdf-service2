@echo off
REM Deployment script for Vercel using API token
REM Set your VERCEL_TOKEN environment variable before running this script

if "%VERCEL_TOKEN%"=="" (
    echo Error: VERCEL_TOKEN environment variable is not set
    echo Please set it with: set VERCEL_TOKEN=your_token_here
    exit /b 1
)

echo Deploying to Vercel with API token...
npx vercel --token %VERCEL_TOKEN% --prod --yes

echo Deployment complete!
