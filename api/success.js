import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Handle different request methods
    let html = '';
    
    if (req.method === 'GET') {
      // For GET requests, check query parameters
      html = req.query.html;
      
      // If no HTML provided, return success message (backward compatibility)
      if (!html) {
        return res.status(200).json({
          success: true,
          message: "Task successfully completed!",
          timestamp: new Date().toISOString(),
          status: "completed",
          info: "Send HTML via 'html' query parameter or POST body to generate PDF"
        });
      }
    } else if (req.method === 'POST') {
      // For POST requests, get HTML from body
      if (typeof req.body === 'string') {
        html = req.body;
      } else if (req.body && req.body.html) {
        html = req.body.html;
      } else {
        return res.status(400).json({ 
          error: "Missing HTML content in request body" 
        });
      }
    } else {
      return res.status(405).json({ 
        error: "Method not allowed. Use GET or POST." 
      });
    }

    // Decode URL-encoded HTML if needed
    if (html.includes('%')) {
      html = decodeURIComponent(html);
    }

    // Ensure HTML has proper structure
    if (!html.includes('<html')) {
      html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;margin:20px;}</style></head><body>${html}</body></html>`;
    }

    // Launch browser with minimal args for stability
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1
    });
    
    // Set content with simpler wait conditions
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    // Wait for any async content to load
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      });
    });

    // Generate PDF with stable settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    await browser.close();

    // Return PDF with proper binary handling
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    
    // End the response with the buffer to ensure proper binary transmission
    res.status(200);
    res.end(pdfBuffer, 'binary');

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate PDF",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
