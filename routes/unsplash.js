const express = require('express');
const unsplashService = require('../services/unsplashService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Search for background images
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query, page = 1, per_page = 12 } = req.query;

    if (!query) {
      return res.status(400).json({ 
        message: 'Search query is required' 
      });
    }

    const result = await unsplashService.searchImages(query, parseInt(page), parseInt(per_page));

    res.json({
      message: 'Images retrieved successfully',
      data: result,
      fallback: result.fallback || false
    });
  } catch (error) {
    console.error('Image search error:', error);
    res.status(500).json({ message: 'Failed to search images' });
  }
});

// Get curated images by category
router.get('/curated/:category', authMiddleware, async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, per_page = 12 } = req.query;

    const result = await unsplashService.getCuratedImages(category, parseInt(page), parseInt(per_page));

    res.json({
      message: 'Curated images retrieved successfully',
      data: result,
      category,
      fallback: result.fallback || false
    });
  } catch (error) {
    console.error('Curated images error:', error);
    res.status(500).json({ message: 'Failed to get curated images' });
  }
});

// Get random image for purpose
router.get('/random', authMiddleware, async (req, res) => {
  try {
    const { purpose = 'business' } = req.query;

    const result = await unsplashService.getRandomImage(purpose);

    res.json({
      message: 'Random image retrieved successfully',
      data: result,
      fallback: result.fallback || false
    });
  } catch (error) {
    console.error('Random image error:', error);
    res.status(500).json({ message: 'Failed to get random image' });
  }
});

// Get suggested search terms
router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const { purpose, audience } = req.query;

    if (!purpose) {
      return res.status(400).json({ 
        message: 'Purpose parameter is required' 
      });
    }

    const suggestions = unsplashService.getSuggestedSearchTerms(purpose, audience);

    res.json({
      message: 'Search suggestions retrieved successfully',
      suggestions,
      purpose,
      audience
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Failed to get search suggestions' });
  }
});

// Download image for banner generation
router.post('/download', authMiddleware, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ 
        message: 'Image URL is required' 
      });
    }

    const result = await unsplashService.downloadImageForBanner(imageUrl);

    if (!result.success) {
      return res.status(400).json({ 
        message: result.error || 'Failed to download image' 
      });
    }

    res.json({
      message: 'Image downloaded successfully',
      data: {
        base64: result.base64
      }
    });
  } catch (error) {
    console.error('Image download error:', error);
    res.status(500).json({ message: 'Failed to download image' });
  }
});

// Get popular categories
router.get('/categories', authMiddleware, async (req, res) => {
  try {
    const categories = [
      { id: 'business', name: 'Business', description: 'Professional and corporate images' },
      { id: 'creative', name: 'Creative', description: 'Artistic and colorful designs' },
      { id: 'nature', name: 'Nature', description: 'Landscapes and natural scenes' },
      { id: 'technology', name: 'Technology', description: 'Tech and digital themes' },
      { id: 'abstract', name: 'Abstract', description: 'Patterns and abstract designs' },
      { id: 'minimal', name: 'Minimal', description: 'Clean and simple backgrounds' },
      { id: 'food', name: 'Food', description: 'Culinary and restaurant themes' },
      { id: 'travel', name: 'Travel', description: 'Destinations and adventure' },
      { id: 'fitness', name: 'Fitness', description: 'Health and wellness themes' },
      { id: 'education', name: 'Education', description: 'Learning and academic themes' }
    ];

    res.json({
      message: 'Categories retrieved successfully',
      categories
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ message: 'Failed to get categories' });
  }
});

module.exports = router;