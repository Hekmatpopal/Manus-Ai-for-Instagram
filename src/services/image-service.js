const axios = require('axios');
const config = require('../config');
const logger = require('../logger');

class ImageService {
  /**
   * Fetch image from Unsplash
   * @param {string} query - Search query
   * @param {object} options - Options
   * @returns {Promise<object>} Image object with URL and metadata
   */
  async fetchUnsplashImage(query, options = {}) {
    try {
      if (!config.images.unsplash.apiKey) {
        throw new Error('Unsplash API key not configured');
      }

      const { orientation = 'landscape', perPage = 1 } = options;

      const response = await axios.get(`${config.images.unsplash.baseUrl}/search/photos`, {
        params: {
          query,
          orientation,
          per_page: perPage,
          client_id: config.images.unsplash.apiKey
        }
      });

      if (response.data.results.length === 0) {
        logger.warn('No images found on Unsplash', { query });
        return null;
      }

      const image = response.data.results[0];
      const result = {
        url: image.urls.regular,
        smallUrl: image.urls.small,
        author: image.user.name,
        authorUrl: image.user.links.html,
        source: 'unsplash',
        query
      };

      logger.info('Image fetched from Unsplash', { query });
      return result;
    } catch (error) {
      logger.error('Error fetching image from Unsplash', { error: error.message, query });
      throw error;
    }
  }

  /**
   * Fetch image from Pexels
   * @param {string} query - Search query
   * @param {object} options - Options
   * @returns {Promise<object>} Image object with URL and metadata
   */
  async fetchPexelsImage(query, options = {}) {
    try {
      if (!config.images.pexels.apiKey) {
        throw new Error('Pexels API key not configured');
      }

      const { orientation = 'landscape', perPage = 1 } = options;

      const response = await axios.get(`${config.images.pexels.baseUrl}/search`, {
        params: {
          query,
          orientation,
          per_page: perPage
        },
        headers: {
          'Authorization': config.images.pexels.apiKey
        }
      });

      if (response.data.photos.length === 0) {
        logger.warn('No images found on Pexels', { query });
        return null;
      }

      const photo = response.data.photos[0];
      const result = {
        url: photo.src.large,
        smallUrl: photo.src.medium,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        source: 'pexels',
        query
      };

      logger.info('Image fetched from Pexels', { query });
      return result;
    } catch (error) {
      logger.error('Error fetching image from Pexels', { error: error.message, query });
      throw error;
    }
  }

  /**
   * Fetch image from either source, with fallback
   * @param {string} query - Search query
   * @param {string} preferred - Preferred source (unsplash or pexels)
   * @returns {Promise<object>} Image object
   */
  async fetchImage(query, preferred = 'unsplash') {
    try {
      if (preferred === 'unsplash') {
        const image = await this.fetchUnsplashImage(query);
        if (image) return image;
        
        // Fallback to Pexels
        return await this.fetchPexelsImage(query);
      } else {
        const image = await this.fetchPexelsImage(query);
        if (image) return image;
        
        // Fallback to Unsplash
        return await this.fetchUnsplashImage(query);
      }
    } catch (error) {
      logger.error('Error fetching image', { error: error.message, query });
      throw error;
    }
  }

  /**
   * Get multiple images for carousel
   * @param {string} query - Search query
   * @param {number} count - Number of images
   * @returns {Promise<Array>} Array of image objects
   */
  async fetchCarouselImages(query, count = 5) {
    try {
      const images = [];
      
      const response = await axios.get(`${config.images.unsplash.baseUrl}/search/photos`, {
        params: {
          query,
          per_page: count,
          client_id: config.images.unsplash.apiKey
        }
      });

      response.data.results.forEach(image => {
        images.push({
          url: image.urls.regular,
          smallUrl: image.urls.small,
          author: image.user.name,
          authorUrl: image.user.links.html,
          source: 'unsplash'
        });
      });

      logger.info('Carousel images fetched', { query, count: images.length });
      return images;
    } catch (error) {
      logger.error('Error fetching carousel images', { error: error.message, query });
      throw error;
    }
  }
}

module.exports = ImageService;
