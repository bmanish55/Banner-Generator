import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateBannerHTML = (design) => {
  const { colors, font, textContent, layout, theme } = design;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          width: 1200px;
          height: 630px;
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: ${font};
          overflow: hidden;
        }
        .container {
          width: 90%;
          height: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }
        .headline {
          font-size: 72px;
          font-weight: bold;
          color: ${colors.accent};
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .subtext {
          font-size: 32px;
          color: ${colors.accent};
          opacity: 0.9;
        }
        .theme-badge {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: ${colors.accent};
          color: ${colors.primary};
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 18px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="headline">${textContent}</div>
        <div class="subtext">${layout}</div>
      </div>
      <div class="theme-badge">${theme}</div>
    </body>
    </html>
  `;
};

export const renderBannerToPNG = async (design, outputFilename) => {
  const publicDir = path.join(__dirname, '../../public/banners');
  
  // Ensure directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, outputFilename);
  
  let browser;
  try {
    const launchOptions = {
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
    
    // Use system Chrome if available
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    
    browser = await puppeteer.launch(launchOptions);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    
    const html = generateBannerHTML(design);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    await page.screenshot({
      path: outputPath,
      type: 'png'
    });
    
    return `/banners/${outputFilename}`;
  } catch (error) {
    console.error('Puppeteer Error:', error);
    throw new Error('Failed to generate banner image');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
