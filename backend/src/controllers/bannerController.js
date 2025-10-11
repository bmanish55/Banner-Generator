import Banner from '../models/Banner.js';
import { generateDesignVariations } from '../utils/openaiService.js';
import { renderBannerToPNG } from '../utils/puppeteerService.js';

export const generateDesigns = async (req, res) => {
  try {
    const { requirements } = req.body;

    if (!requirements) {
      return res.status(400).json({ error: 'Requirements are required' });
    }

    const designs = await generateDesignVariations(requirements);
    res.json({ designs });
  } catch (error) {
    console.error('Generate designs error:', error);
    res.status(500).json({ error: 'Failed to generate designs' });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, requirements, design } = req.body;
    const userId = req.user.id;

    if (!title || !requirements || !design) {
      return res.status(400).json({ error: 'Title, requirements, and design are required' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `banner-${userId}-${timestamp}.png`;

    // Render banner to PNG
    const imagePath = await renderBannerToPNG(design, filename);

    // Save to database
    const bannerId = Banner.create(userId, title, requirements, design, imagePath);
    const banner = Banner.findById(bannerId, userId);

    res.status(201).json({
      message: 'Banner created successfully',
      banner
    });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ error: 'Failed to create banner' });
  }
};

export const getBanners = async (req, res) => {
  try {
    const userId = req.user.id;
    const banners = Banner.findByUserId(userId);
    res.json({ banners });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

export const getBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const banner = Banner.findById(id, userId);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({ banner });
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, requirements, design } = req.body;

    const banner = Banner.findById(id, userId);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (requirements) updates.requirements = requirements;
    if (design) {
      updates.designData = design;
      // Regenerate image if design changed
      const timestamp = Date.now();
      const filename = `banner-${userId}-${timestamp}.png`;
      updates.imagePath = await renderBannerToPNG(design, filename);
    }

    Banner.update(id, userId, updates);
    const updatedBanner = Banner.findById(id, userId);

    res.json({
      message: 'Banner updated successfully',
      banner: updatedBanner
    });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const banner = Banner.findById(id, userId);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    Banner.delete(id, userId);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};
