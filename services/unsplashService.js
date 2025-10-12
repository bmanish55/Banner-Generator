const axios = require('axios');
require('dotenv').config();

class UnsplashService {
  constructor() {
    this.baseURL = 'https://api.unsplash.com';
  }

  get accessKey() {
    return process.env.UNSPLASH_ACCESS_KEY;
  }

  get hasValidKey() {
    return !!this.accessKey;
  }

  // Search for images based on query
  async searchImages(query, page = 1, perPage = 12) {
    if (!this.hasValidKey) {
      console.warn('⚠️ Unsplash access key not found. Using fallback images.');
      return this.getFallbackImages();
    }

    try {
      const response = await axios.get(`${this.baseURL}/search/photos`, {
        params: {
          query,
          page,
          per_page: perPage,
          orientation: 'landscape',
          content_filter: 'high',
        },
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
        },
      });

      const images = response.data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        small: photo.urls.small,
        description: photo.alt_description || photo.description || 'Untitled',
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        color: photo.color,
      }));

      return {
        success: true,
        images,
        total: response.data.total,
        totalPages: response.data.total_pages,
        fallback: false,
      };
    } catch (error) {
      console.error('Unsplash API error:', error.message);
      return this.getFallbackImages();
    }
  }

  // Get curated images for specific categories
  async getCuratedImages(category, page = 1, perPage = 12) {
    if (!this.hasValidKey) {
      console.warn('⚠️ Unsplash access key not found. Using fallback images.');
      return this.getFallbackImages();
    }

    try {
      // Map categories to Unsplash collection IDs
      const collectionMap = {
        business: '1065412',
        technology: '162213',
        lifestyle: '1103088',
        nature: '1114848',
        food: '1114808',
        travel: '1114849',
        fashion: '1114847',
        architecture: '1114846',
      };

      const collectionId = collectionMap[category] || collectionMap.business;

      const response = await axios.get(`${this.baseURL}/collections/${collectionId}/photos`, {
        params: {
          page,
          per_page: perPage,
          orientation: 'landscape',
        },
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
        },
      });

      const images = response.data.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        small: photo.urls.small,
        description: photo.alt_description || photo.description || 'Untitled',
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        color: photo.color,
      }));

      return {
        success: true,
        images,
        total: images.length,
        totalPages: 1,
        fallback: false,
      };
    } catch (error) {
      console.error('Unsplash API error:', error.message);
      return this.getFallbackImages();
    }
  }

  // Get a random image based on query
  async getRandomImage(query) {
    if (!this.hasValidKey) {
      const fallback = this.getFallbackImages();
      return {
        success: true,
        image: fallback.images[0],
        fallback: true,
      };
    }

    try {
      const response = await axios.get(`${this.baseURL}/photos/random`, {
        params: {
          query,
          orientation: 'landscape',
          content_filter: 'high',
        },
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
        },
      });

      const photo = response.data;
      const image = {
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        small: photo.urls.small,
        description: photo.alt_description || photo.description || 'Untitled',
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        color: photo.color,
      };

      return {
        success: true,
        image,
        fallback: false,
      };
    } catch (error) {
      console.error('Unsplash API error:', error.message);
      const fallback = this.getFallbackImages();
      return {
        success: true,
        image: fallback.images[0],
        fallback: true,
      };
    }
  }

  // Get search suggestions based on purpose and audience
  getSuggestions(purpose, targetAudience) {
    const suggestions = [];
    
    // Purpose-based suggestions
    const purposeMap = {
      'Sale announcement': ['discount', 'shopping', 'sale', 'retail'],
      'Event promotion': ['event', 'celebration', 'party', 'gathering'],
      'Product launch': ['innovation', 'technology', 'modern', 'launch'],
      'Brand awareness': ['branding', 'corporate', 'professional', 'identity'],
      'Job posting': ['office', 'workplace', 'career', 'professional'],
      'Newsletter signup': ['email', 'communication', 'newsletter', 'subscribe'],
      'Course promotion': ['education', 'learning', 'study', 'knowledge'],
      'Service announcement': ['service', 'support', 'help', 'assistance'],
      'Holiday greeting': ['holiday', 'celebration', 'festive', 'seasonal'],
      'Testimonial showcase': ['testimonial', 'review', 'success', 'achievement'],
    };

    // Audience-based suggestions
    const audienceMap = {
      business: ['corporate', 'professional', 'office', 'meeting'],
      influencer: ['lifestyle', 'social media', 'trendy', 'modern'],
      personal: ['personal', 'individual', 'casual', 'friendly'],
      'e-commerce': ['shopping', 'product', 'retail', 'commerce'],
      education: ['learning', 'education', 'study', 'academic'],
      health: ['health', 'wellness', 'medical', 'fitness'],
      technology: ['technology', 'digital', 'innovation', 'tech'],
      creative: ['creative', 'art', 'design', 'artistic'],
    };

    if (purpose && purposeMap[purpose]) {
      suggestions.push(...purposeMap[purpose]);
    }

    if (targetAudience && audienceMap[targetAudience]) {
      suggestions.push(...audienceMap[targetAudience]);
    }

    // Remove duplicates and return first 8
    return [...new Set(suggestions)].slice(0, 8);
  }

  // Get available categories
  getCategories() {
    return [
      { id: 'business', name: 'Business', description: 'Corporate and professional' },
      { id: 'technology', name: 'Technology', description: 'Tech and innovation' },
      { id: 'lifestyle', name: 'Lifestyle', description: 'Life and wellness' },
      { id: 'nature', name: 'Nature', description: 'Natural and outdoor' },
      { id: 'food', name: 'Food', description: 'Food and dining' },
      { id: 'travel', name: 'Travel', description: 'Travel and adventure' },
      { id: 'fashion', name: 'Fashion', description: 'Style and fashion' },
      { id: 'architecture', name: 'Architecture', description: 'Buildings and structures' },
    ];
  }

  // Download image for banner generation
  async downloadImageForBanner(imageUrl) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      return {
        success: true,
        buffer: Buffer.from(response.data),
        contentType: response.headers['content-type'] || 'image/jpeg',
      };
    } catch (error) {
      console.error('Error downloading image:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Fallback images when API is not available
  getFallbackImages() {
    return {
      success: true,
      images: [
        {
          id: 'fallback-1',
          url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
          thumb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200',
          small: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
          description: 'Modern office workspace',
          photographer: 'Unsplash',
          photographerUrl: 'https://unsplash.com',
          color: '#2563eb',
        },
        {
          id: 'fallback-2',
          url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
          thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200',
          small: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
          description: 'Technology and innovation',
          photographer: 'Unsplash',
          photographerUrl: 'https://unsplash.com',
          color: '#7c3aed',
        },
        {
          id: 'fallback-3',
          url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
          thumb: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200',
          small: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
          description: 'Creative workspace',
          photographer: 'Unsplash',
          photographerUrl: 'https://unsplash.com',
          color: '#059669',
        },
      ],
      total: 3,
      totalPages: 1,
      fallback: true,
    };
  }
}

module.exports = new UnsplashService();