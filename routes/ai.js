const express = require('express');
const { generateDesignSuggestions, optimizeTextForPlatform } = require('../services/aiService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Generate design suggestions
router.post('/design-suggestions', authMiddleware, async (req, res) => {
  try {
    const { purpose, platform, mainText, colors, targetAudience } = req.body;

    // Validation
    if (!purpose || !platform || !mainText || !targetAudience) {
      return res.status(400).json({ 
        message: 'Please provide purpose, platform, mainText, and targetAudience' 
      });
    }

    const suggestions = await generateDesignSuggestions({
      purpose,
      platform,
      mainText,
      colors,
      targetAudience
    });

    res.json({
      message: 'Design suggestions generated successfully',
      suggestions
    });
  } catch (error) {
    console.error('Design suggestions error:', error);
    res.status(500).json({ message: 'Failed to generate design suggestions' });
  }
});

// Optimize text for platform
router.post('/optimize-text', authMiddleware, async (req, res) => {
  try {
    const { text, platform, purpose } = req.body;

    if (!text || !platform || !purpose) {
      return res.status(400).json({ 
        message: 'Please provide text, platform, and purpose' 
      });
    }

    const optimizedText = await optimizeTextForPlatform(text, platform, purpose);

    res.json({
      message: 'Text optimized successfully',
      optimizedText
    });
  } catch (error) {
    console.error('Text optimization error:', error);
    res.status(500).json({ message: 'Failed to optimize text' });
  }
});

module.exports = router;