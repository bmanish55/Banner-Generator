import OpenAI from 'openai';

let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-for-testing',
  });
} catch (error) {
  console.warn('OpenAI initialization warning:', error.message);
}

export const generateDesignVariations = async (requirements) => {
  // Check if OpenAI API key is valid (starts with sk-)
  const hasValidKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-');
  
  if (hasValidKey && openai) {
    try {
      const prompt = `You are a professional graphic designer. Based on the following requirements, generate 3 different banner design variations. Each design should include specific color schemes, fonts, layout suggestions, and text positioning.

Requirements: ${requirements}

Provide the response as a JSON array with 3 design objects. Each object should have:
- name: A creative name for the design
- theme: The overall theme/style (e.g., "Modern Minimalist", "Bold & Vibrant")
- colors: An object with primary, secondary, and accent color hex codes
- font: Suggested font family
- layout: Description of the layout structure
- textContent: Suggested text/headline based on requirements
- description: Brief description of the design concept

Return ONLY valid JSON, no additional text.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative graphic designer who responds only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      const designs = JSON.parse(content);
      
      return Array.isArray(designs) ? designs : [designs];
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fall through to fallback designs
    }
  } else {
    console.log('Using fallback designs (OpenAI API key not configured)');
  }
  
  // Fallback designs if OpenAI fails or is not configured
  return [
    {
      name: 'Classic Professional',
      theme: 'Professional Business',
      colors: { primary: '#2C3E50', secondary: '#ECF0F1', accent: '#3498DB' },
      font: 'Arial, sans-serif',
      layout: 'Centered text with bold headline',
      textContent: requirements.substring(0, 50),
      description: 'A clean, professional design suitable for business use'
    },
    {
      name: 'Modern Vibrant',
      theme: 'Bold & Energetic',
      colors: { primary: '#E74C3C', secondary: '#F39C12', accent: '#FFFFFF' },
      font: 'Helvetica, sans-serif',
      layout: 'Dynamic diagonal layout with emphasis',
      textContent: requirements.substring(0, 50),
      description: 'An eye-catching design with bold colors'
    },
    {
      name: 'Elegant Minimal',
      theme: 'Minimalist Elegance',
      colors: { primary: '#34495E', secondary: '#95A5A6', accent: '#1ABC9C' },
      font: 'Georgia, serif',
      layout: 'Asymmetric layout with ample white space',
      textContent: requirements.substring(0, 50),
      description: 'A sophisticated minimal design with elegant typography'
    }
  ];
};
