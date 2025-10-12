const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const bannerGenerator = require('../services/bannerGenerator');
const { PLATFORM_SPECS } = require('../services/aiService');

const router = express.Router();

// Create a new banner
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, platform, purpose, mainText, colors, targetAudience, designData } = req.body;

    // Validation
    if (!title || !platform || !purpose || !mainText || !targetAudience || !designData) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Get platform dimensions
    const platformSpec = PLATFORM_SPECS[platform.toLowerCase()];
    const dimensions = platformSpec?.post || { width: 1200, height: 630 };

    // Generate banner image
    const bannerResult = await bannerGenerator.generateBanner(designData, dimensions);

    // Save to database
    const bannerData = {
      user_id: req.user.id,
      title,
      platform,
      purpose,
      main_text: mainText,
      colors: JSON.stringify(colors),
      target_audience: targetAudience,
      design_data: JSON.stringify(designData),
      image_url: bannerResult.url
    };

    const banner = await db.createBanner(bannerData);

    res.status(201).json({
      message: 'Banner created successfully',
      banner: {
        ...banner,
        colors: JSON.parse(banner.colors),
        design_data: JSON.parse(banner.design_data),
        image_details: bannerResult
      }
    });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ message: 'Failed to create banner' });
  }
});

// Get user's banners
router.get('/', authMiddleware, async (req, res) => {
  try {
    const banners = await db.getBannersByUser(req.user.id);
    
    const formattedBanners = banners.map(banner => ({
      ...banner,
      colors: JSON.parse(banner.colors || '[]'),
      design_data: JSON.parse(banner.design_data || '{}')
    }));

    res.json({
      message: 'Banners retrieved successfully',
      banners: formattedBanners
    });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ message: 'Failed to retrieve banners' });
  }
});

// Get specific banner
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const banner = await db.getBannerById(req.params.id, req.user.id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    const formattedBanner = {
      ...banner,
      colors: JSON.parse(banner.colors || '[]'),
      design_data: JSON.parse(banner.design_data || '{}')
    };

    res.json({
      message: 'Banner retrieved successfully',
      banner: formattedBanner
    });
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({ message: 'Failed to retrieve banner' });
  }
});

// Update banner
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, designData } = req.body;

    if (!title || !designData) {
      return res.status(400).json({ message: 'Please provide title and designData' });
    }

    // Get existing banner
    const existingBanner = await db.getBannerById(req.params.id, req.user.id);
    if (!existingBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Get platform dimensions
    const platform = existingBanner.platform;
    const platformSpec = PLATFORM_SPECS[platform.toLowerCase()];
    const dimensions = platformSpec?.post || { width: 1200, height: 630 };

    // Generate new banner image
    const bannerResult = await bannerGenerator.generateBanner(designData, dimensions);

    // Update in database
    const updateData = {
      title,
      design_data: JSON.stringify(designData),
      image_url: bannerResult.url
    };

    await db.updateBanner(req.params.id, req.user.id, updateData);

    res.json({
      message: 'Banner updated successfully',
      banner: {
        id: req.params.id,
        title,
        design_data: designData,
        image_url: bannerResult.url,
        image_details: bannerResult
      }
    });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ message: 'Failed to update banner' });
  }
});

// Delete banner
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.deleteBanner(req.params.id, req.user.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ message: 'Failed to delete banner' });
  }
});

// Get platform specifications
router.get('/specs/platforms', (req, res) => {
  res.json({
    message: 'Platform specifications retrieved successfully',
    platforms: PLATFORM_SPECS
  });
});

module.exports = router;