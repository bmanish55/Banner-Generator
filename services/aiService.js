const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Platform-specific dimensions and characteristics
const PLATFORM_SPECS = {
  instagram: {
    post: { width: 1080, height: 1080, name: 'Instagram Post' },
    story: { width: 1080, height: 1920, name: 'Instagram Story' }
  },
  linkedin: {
    post: { width: 1200, height: 627, name: 'LinkedIn Post' }
  },
  twitter: {
    post: { width: 1200, height: 675, name: 'Twitter/X Post' }
  },
  facebook: {
    post: { width: 1200, height: 630, name: 'Facebook Post' }
  }
};

// Color palettes based on purpose and audience
const COLOR_SCHEMES = {
  business: ['#2C3E50', '#3498DB', '#FFFFFF', '#ECF0F1'],
  creative: ['#E74C3C', '#F39C12', '#9B59B6', '#FFFFFF'],
  modern: ['#34495E', '#1ABC9C', '#FFFFFF', '#BDC3C7'],
  elegant: ['#2C2C2C', '#D4AF37', '#FFFFFF', '#F8F8F8'],
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFFFFF'],
  professional: ['#1E3A8A', '#6B7280', '#FFFFFF', '#F3F4F6']
};

const generateDesignSuggestions = async (requirements) => {
  try {
    const { purpose, platform, mainText, colors, targetAudience } = requirements;
    
    const prompt = `
As a professional graphic designer, create 3 distinct design suggestions for a social media banner with these requirements:

Purpose: ${purpose}
Platform: ${platform}
Main Text: "${mainText}"
Preferred Colors: ${colors || 'Not specified'}
Target Audience: ${targetAudience}

For each design, provide:
1. Layout style (e.g., "Centered text with minimal graphics", "Left-aligned text with right-side image")
2. Color scheme (4-5 specific hex codes)
3. Font style recommendation (e.g., "Bold sans-serif headline", "Modern serif")
4. Background style (solid, gradient, pattern, etc.)
5. Additional design elements (icons, shapes, etc.)
6. Text hierarchy and sizing suggestions

Respond in JSON format with this structure:
{
  "designs": [
    {
      "id": 1,
      "name": "Design Name",
      "layout": "Layout description",
      "colors": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "font": "Font recommendation",
      "background": "Background style",
      "elements": ["element1", "element2"],
      "textHierarchy": "Text styling guide"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1000
    });

    const aiResponse = response.choices[0].message.content;
    const designSuggestions = JSON.parse(aiResponse);

    // Add platform-specific dimensions
    const platformSpec = PLATFORM_SPECS[platform.toLowerCase()];
    const dimensions = platformSpec?.post || { width: 1200, height: 630 };

    return {
      ...designSuggestions,
      platformDimensions: dimensions,
      suggestedColorSchemes: getSuggestedColorSchemes(targetAudience, purpose)
    };

  } catch (error) {
    console.error('AI generation error:', error);
    
    // Fallback to pre-defined templates
    return generateFallbackDesigns(requirements);
  }
};

const getSuggestedColorSchemes = (audience, purpose) => {
  const schemes = [];
  
  if (audience === 'business' || purpose.includes('professional')) {
    schemes.push(COLOR_SCHEMES.business, COLOR_SCHEMES.professional);
  }
  
  if (audience === 'influencer' || purpose.includes('creative')) {
    schemes.push(COLOR_SCHEMES.creative, COLOR_SCHEMES.vibrant);
  }
  
  schemes.push(COLOR_SCHEMES.modern, COLOR_SCHEMES.elegant);
  
  return schemes.slice(0, 3);
};

const generateFallbackDesigns = (requirements) => {
  const { platform, targetAudience } = requirements;
  const platformSpec = PLATFORM_SPECS[platform.toLowerCase()];
  const dimensions = platformSpec?.post || { width: 1200, height: 630 };
  
  return {
    designs: [
      {
        id: 1,
        name: "Bold & Modern",
        layout: "Centered text with geometric background",
        colors: COLOR_SCHEMES.modern,
        font: "Bold sans-serif for headline, clean secondary font",
        background: "Gradient with geometric shapes",
        elements: ["Abstract shapes", "Subtle shadows"],
        textHierarchy: "Large headline, medium subtext, small CTA"
      },
      {
        id: 2,
        name: "Professional Clean",
        layout: "Left-aligned text with right-side accent",
        colors: COLOR_SCHEMES.professional,
        font: "Professional sans-serif throughout",
        background: "Clean solid color with subtle texture",
        elements: ["Minimal lines", "Professional iconography"],
        textHierarchy: "Clear hierarchy with consistent spacing"
      },
      {
        id: 3,
        name: "Creative Vibrant",
        layout: "Dynamic diagonal layout with overlapping elements",
        colors: COLOR_SCHEMES.vibrant,
        font: "Modern display font for impact",
        background: "Colorful gradient with creative elements",
        elements: ["Creative shapes", "Playful graphics"],
        textHierarchy: "Eye-catching headline with supporting text"
      }
    ],
    platformDimensions: dimensions,
    suggestedColorSchemes: getSuggestedColorSchemes(targetAudience, requirements.purpose)
  };
};

const optimizeTextForPlatform = async (text, platform, purpose) => {
  try {
    const prompt = `
Optimize this text for a ${platform} ${purpose} banner: "${text}"

Consider:
- Platform character limits and best practices
- Engagement optimization
- Clear call-to-action
- Professional yet engaging tone

Provide:
1. Optimized main headline (short, punchy)
2. Supporting text (if needed)
3. Call-to-action suggestion
4. Alternative versions (2-3 options)

Respond in JSON format:
{
  "optimized": {
    "headline": "Main headline",
    "supporting": "Supporting text",
    "cta": "Call to action"
  },
  "alternatives": [
    {"headline": "Alt 1", "supporting": "...", "cta": "..."},
    {"headline": "Alt 2", "supporting": "...", "cta": "..."}
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Text optimization error:', error);
    return {
      optimized: {
        headline: text,
        supporting: "",
        cta: "Learn More"
      },
      alternatives: []
    };
  }
};

module.exports = {
  generateDesignSuggestions,
  optimizeTextForPlatform,
  PLATFORM_SPECS,
  COLOR_SCHEMES
};