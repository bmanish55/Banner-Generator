const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class BannerGenerator {
  constructor() {
    this.ensureDirectories();
  }

  async ensureDirectories() {
    const dirs = ['public', 'public/banners'];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }
    }
  }

  async generateBanner(designData, dimensions) {
    const { width, height } = dimensions;
    
    try {
      // Generate HTML for the banner
      const html = this.generateBannerHTML(designData, dimensions);
      
      // Use Puppeteer to convert HTML to image
      const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      // Set viewport to banner dimensions
      await page.setViewport({ width, height });
      
      // Set HTML content with Google Fonts
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for fonts and animations to load
      await page.waitForTimeout(2000);
      
      // Take screenshot
      const filename = `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
      const filepath = path.join('public', 'banners', filename);
      
      await page.screenshot({
        path: filepath,
        width,
        height,
        type: 'png',
        clip: { x: 0, y: 0, width, height }
      });
      
      await browser.close();
      
      return {
        filename,
        url: `/banners/${filename}`,
        dimensions: { width, height }
      };
    } catch (error) {
      console.error('Banner generation error:', error);
      throw new Error('Failed to generate banner');
    }
  }

  generateBannerHTML(designData, dimensions) {
    const { width, height } = dimensions;
    const { 
      mainText, 
      textStyle = {}, 
      colors = ['#FFFFFF', '#3498DB'], 
      backgroundImage, 
      designElements = [],
      animations = []
    } = designData;

    // Create CSS for background
    let backgroundCSS = '';
    if (backgroundImage && backgroundImage.url) {
      backgroundCSS = `
        background-image: 
          linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
          url('${backgroundImage.url}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      `;
    } else {
      backgroundCSS = `background: linear-gradient(135deg, ${colors[0] || '#667eea'}, ${colors[1] || '#764ba2'});`;
    }

    // Calculate responsive font size with text style overrides
    const baseFontSize = textStyle.fontSize || Math.min(width, height) * 0.08;
    const fontFamily = textStyle.fontFamily || 'Inter';
    const fontWeight = textStyle.fontWeight || 'bold';
    const textColor = textStyle.color || (backgroundImage ? '#FFFFFF' : '#FFFFFF');

    // Generate text styling
    let textStyleCSS = `
      font-size: ${baseFontSize}px;
      font-family: '${fontFamily}', sans-serif;
      font-weight: ${fontWeight};
      color: ${textColor};
      line-height: 1.2;
      margin-bottom: 20px;
      max-width: 90%;
      word-wrap: break-word;
      position: relative;
      z-index: 100;
    `;

    // Add text effects
    if (textStyle.shadow) {
      textStyleCSS += `text-shadow: 3px 3px 6px rgba(0,0,0,0.7);`;
    }
    if (textStyle.outline) {
      textStyleCSS += `-webkit-text-stroke: 2px rgba(0,0,0,0.8); text-stroke: 2px rgba(0,0,0,0.8);`;
    }
    if (textStyle.gradient) {
      textStyleCSS += `
        background: linear-gradient(45deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      `;
    }

    // Add animation to text
    let textAnimationCSS = '';
    if (textStyle.animation && textStyle.animation !== 'none') {
      textAnimationCSS = `animation: ${textStyle.animation} 1s ease-in-out;`;
    }

    // Generate design elements HTML
    const elementsHTML = this.generateAdvancedElements(designElements, width, height);

    // Generate CSS animations
    const animationsCSS = this.generateAnimationsCSS();

    // Generate Google Fonts import
    const googleFontsCSS = `@import url('https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@300;400;500;600;700;800&display=swap');`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          ${googleFontsCSS}
          
          ${animationsCSS}
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            width: ${width}px;
            height: ${height}px;
            font-family: '${fontFamily}', sans-serif;
            overflow: hidden;
            position: relative;
            ${backgroundCSS}
          }
          
          .banner-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 40px;
            position: relative;
            z-index: 10;
          }
          
          .main-text {
            ${textStyleCSS}
            ${textAnimationCSS}
          }
          
          .design-elements {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
          }

          ${backgroundImage ? `
          .background-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3));
            z-index: 2;
          }
          ` : ''}
        </style>
      </head>
      <body>
        ${backgroundImage ? '<div class="background-overlay"></div>' : ''}
        <div class="design-elements">
          ${elementsHTML}
        </div>
        <div class="banner-container">
          <div class="main-text">${this.escapeHtml(mainText || 'Your Banner Text')}</div>
        </div>
      </body>
      </html>
    `;
  }

  generateAdvancedElements(designElements, width, height) {
    let elementsHTML = '';

    designElements.forEach(element => {
      const x = element.x || 50;
      const y = element.y || 50;
      const w = element.width || 100;
      const h = element.height || 100;
      const fill = element.fill || '#667eea';
      const stroke = element.stroke || '#4f46e5';
      const strokeWidth = element.strokeWidth || 1;
      const opacity = element.opacity || 1;

      // Convert relative positions to absolute pixels
      const absX = (x / 100) * width;
      const absY = (y / 100) * height;
      const absW = (w / 100) * width;
      const absH = (h / 100) * height;

      const baseStyle = `
        position: absolute;
        left: ${absX}px;
        top: ${absY}px;
        width: ${absW}px;
        height: ${absH}px;
        opacity: ${opacity};
        z-index: 5;
      `;

      if (element.type === 'shape') {
        elementsHTML += this.generateShape(element.shape, baseStyle, fill, stroke, strokeWidth);
      } else if (element.type === 'icon') {
        elementsHTML += this.generateIcon(element.icon, baseStyle, fill);
      } else if (element.type === 'decorative') {
        elementsHTML += this.generateDecorativeElement(element.element, baseStyle, fill);
      }
    });

    return elementsHTML;
  }

  generateShape(shape, baseStyle, fill, stroke, strokeWidth) {
    switch (shape) {
      case 'rectangle':
        return `<div style="${baseStyle} background-color: ${fill}; border: ${strokeWidth}px solid ${stroke};"></div>`;
      
      case 'circle':
        return `<div style="${baseStyle} background-color: ${fill}; border: ${strokeWidth}px solid ${stroke}; border-radius: 50%;"></div>`;
      
      case 'triangle':
        return `<div style="${baseStyle} background: transparent; border-left: ${baseStyle.match(/width: (\d+)px/)[1]/2}px solid transparent; border-right: ${baseStyle.match(/width: (\d+)px/)[1]/2}px solid transparent; border-bottom: ${baseStyle.match(/height: (\d+)px/)[1]}px solid ${fill}; width: 0; height: 0;"></div>`;
      
      case 'diamond':
        return `<div style="${baseStyle} background-color: ${fill}; border: ${strokeWidth}px solid ${stroke}; transform: rotate(45deg);"></div>`;
      
      case 'star':
        return `<div style="${baseStyle} background: transparent;">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M50,5 L60,35 L95,35 L68,57 L78,91 L50,70 L22,91 L32,57 L5,35 L40,35 Z" 
                  fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
          </svg>
        </div>`;
      
      case 'arrow':
        return `<div style="${baseStyle} background: transparent;">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M10,50 L70,50 L60,40 L80,50 L60,60 Z" 
                  fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
          </svg>
        </div>`;
      
      default:
        return `<div style="${baseStyle} background-color: ${fill}; border: ${strokeWidth}px solid ${stroke};"></div>`;
    }
  }

  generateIcon(icon, baseStyle, fill) {
    const iconSVGs = {
      'chart': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>`,
      'trending': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>`,
      'users': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 16.8 6.8L15 8.4V12h-2V7c0-.35.18-.68.49-.86l4.4-2.2A2 2 0 0 1 20 4.5h1c1.66 0 3 1.34 3 3v6c0 .55-.45 1-1 1h-3v8h-2z"/></svg>`,
      'cart': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
      'target': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-3-8c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"/></svg>`,
      'shield': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/></svg>`,
      'star': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      'heart': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
      'facebook': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
      'instagram': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
      'twitter': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
      'linkedin': `<svg viewBox="0 0 24 24" fill="${fill}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
    };

    return `<div style="${baseStyle}">${iconSVGs[icon] || iconSVGs['star']}</div>`;
  }

  generateDecorativeElement(element, baseStyle, fill) {
    switch (element) {
      case 'sparkle':
        return `<div style="${baseStyle} background: transparent;">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M50 10 L55 35 L80 30 L60 50 L85 55 L60 70 L80 70 L55 65 L50 90 L45 65 L20 70 L40 50 L15 45 L40 30 L20 30 L45 35 Z" 
                  fill="${fill}" opacity="0.8"/>
          </svg>
        </div>`;
      
      case 'burst':
        return `<div style="${baseStyle} background: transparent;">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="${fill}" opacity="0.6"/>
            <circle cx="50" cy="50" r="20" fill="${fill}" opacity="0.8"/>
            <circle cx="50" cy="50" r="10" fill="${fill}"/>
          </svg>
        </div>`;
      
      case 'ribbon':
        return `<div style="${baseStyle} background: transparent;">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M10 30 L90 30 L85 50 L90 70 L10 70 L15 50 Z" 
                  fill="${fill}" opacity="0.9"/>
          </svg>
        </div>`;
      
      default:
        return `<div style="${baseStyle} background-color: ${fill}; border-radius: 50%; opacity: 0.7;"></div>`;
    }
  }

  generateAnimationsCSS() {
    return `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes zoomIn {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      @keyframes typewriter {
        from { width: 0; }
        to { width: 100%; }
      }
    `;
  }

  escapeHtml(text) {
    const div = { innerHTML: text };
    return text.replace(/[&<>"']/g, function(match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }
}

module.exports = new BannerGenerator();