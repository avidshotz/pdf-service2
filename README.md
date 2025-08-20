# PDF Service - HTML to PDF Converter

A Vercel Node.js Serverless Function that converts HTML to PDF using Puppeteer and Chromium.

## Setup

1. **Get Vercel API Token**:
   - Go to https://vercel.com/account/tokens
   - Create a new token named "PDF Service API Token"
   - Copy the token (shown only once)

2. **Set Environment Variable**:
   
   **Windows (PowerShell):**
   ```powershell
   $env:VERCEL_TOKEN="your_token_here"
   ```
   
   **Windows (Command Prompt):**
   ```cmd
   set VERCEL_TOKEN=your_token_here
   ```
   
   **Linux/Mac:**
   ```bash
   export VERCEL_TOKEN=your_token_here
   ```

## Deployment

### Option 1: Using deployment scripts
```bash
# Windows
./deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Direct command
```bash
npx vercel --token $VERCEL_TOKEN --prod --yes
```

## Usage

Your serverless function is available at:
```
https://pdf-service2-5xlwxkuud-avidshotzs-projects.vercel.app/api/success
```

### 1. Success Message (Backward Compatibility)
Without HTML parameter, returns:
```json
{
  "success": true,
  "message": "Task successfully completed!",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "status": "completed",
  "info": "Send HTML via 'html' query parameter or POST body to generate PDF"
}
```

### 2. HTML to PDF Conversion

**GET Request with Query Parameter:**
```bash
curl "https://pdf-service2-5xlwxkuud-avidshotzs-projects.vercel.app/api/success?html=<h1>Hello World</h1>" \
  --output test.pdf
```

**POST Request with HTML Body:**
```bash
curl -X POST \
  "https://pdf-service2-5xlwxkuud-avidshotzs-projects.vercel.app/api/success" \
  -H "Content-Type: text/html" \
  -d "<html><body><h1>Hello PDF!</h1><p>This will be converted to PDF</p></body></html>" \
  --output output.pdf
```

**POST Request with JSON:**
```bash
curl -X POST \
  "https://pdf-service2-5xlwxkuud-avidshotzs-projects.vercel.app/api/success" \
  -H "Content-Type: application/json" \
  -d '{"html":"<html><body><h1>JSON to PDF</h1></body></html>"}' \
  --output json.pdf
```

## JavaScript Integration

```javascript
// Convert HTML to PDF
async function generatePDF(htmlContent) {
  const response = await fetch('https://pdf-service2-5xlwxkuud-avidshotzs-projects.vercel.app/api/success', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ html: htmlContent })
  });
  
  if (response.ok) {
    const pdfBlob = await response.blob();
    // Create download link
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated.pdf';
    a.click();
  }
}

// Usage
generatePDF('<h1>My PDF Document</h1><p>Content goes here...</p>');
```

## Features

- ✅ **Free**: Runs on Vercel's free tier
- ✅ **No Authentication**: Publicly accessible API
- ✅ **Multiple Input Methods**: GET query params, POST body, JSON
- ✅ **Full HTML Support**: CSS, images, complex layouts
- ✅ **PDF Options**: A4 format, margins, background printing
- ✅ **Error Handling**: Detailed error responses
- ✅ **CORS Enabled**: Works from browser applications
