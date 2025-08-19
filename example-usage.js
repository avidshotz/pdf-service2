// PDF Service Integration Examples

const PDF_SERVICE_URL = 'https://pdf-service2-anyj49abr-avidshotzs-projects.vercel.app/api/success';

// Basic PDF Generation Function
async function generatePDF(htmlContent) {
  try {
    const response = await fetch(PDF_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html: htmlContent })
    });

    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

// Download PDF directly in browser
async function downloadPDF(htmlContent, filename = 'document.pdf') {
  try {
    const pdfBlob = await generatePDF(htmlContent);
    
    // Create download link
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('PDF downloaded successfully!');
  } catch (error) {
    console.error('Download failed:', error);
  }
}

// Display PDF in iframe/embed
async function displayPDF(htmlContent, containerId) {
  try {
    const pdfBlob = await generatePDF(htmlContent);
    const url = window.URL.createObjectURL(pdfBlob);
    
    const container = document.getElementById(containerId);
    container.innerHTML = `<iframe src="${url}" width="100%" height="600px"></iframe>`;
    
  } catch (error) {
    console.error('Display failed:', error);
  }
}

// Convert form data to PDF
async function convertFormToPDF(formData) {
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Form Submission</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        ${Object.entries(formData).map(([key, value]) => `
          <div class="field">
            <span class="label">${key}:</span> ${value}
          </div>
        `).join('')}
      </body>
    </html>
  `;
  
  return await downloadPDF(html, 'form-submission.pdf');
}

// React/Vue Component Example
class PDFGenerator {
  constructor() {
    this.serviceUrl = PDF_SERVICE_URL;
  }

  async generate(htmlContent, options = {}) {
    const { download = false, filename = 'document.pdf' } = options;
    
    try {
      const pdfBlob = await generatePDF(htmlContent);
      
      if (download) {
        await this.download(pdfBlob, filename);
      }
      
      return pdfBlob;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  }

  async download(pdfBlob, filename) {
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Usage Examples:

// Example 1: Simple HTML to PDF
const simpleHTML = '<h1>Hello World</h1><p>This is my first PDF!</p>';
// downloadPDF(simpleHTML, 'hello.pdf');

// Example 2: Complex document
const complexHTML = `
  <html>
    <head>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; }
        .content { margin-top: 30px; line-height: 1.6; }
        .signature { margin-top: 50px; border-top: 1px solid #999; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Business Report</h1>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="content">
        <h2>Executive Summary</h2>
        <p>This quarter showed significant growth...</p>
        
        <h2>Financial Overview</h2>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <tr><th>Metric</th><th>Q1</th><th>Q2</th></tr>
          <tr><td>Revenue</td><td>$100K</td><td>$150K</td></tr>
          <tr><td>Profit</td><td>$20K</td><td>$35K</td></tr>
        </table>
      </div>
      <div class="signature">
        <p>Prepared by: Your Name</p>
      </div>
    </body>
  </html>
`;

// Example 3: Form handling
/*
document.getElementById('generateReport').addEventListener('click', async () => {
  const formData = {
    'Customer Name': document.getElementById('customerName').value,
    'Order Date': document.getElementById('orderDate').value,
    'Total Amount': document.getElementById('totalAmount').value
  };
  
  await convertFormToPDF(formData);
});
*/

// Example 4: Class usage
/*
const pdfGen = new PDFGenerator();
pdfGen.generate(complexHTML, { download: true, filename: 'business-report.pdf' });
*/

export { generatePDF, downloadPDF, displayPDF, convertFormToPDF, PDFGenerator };
