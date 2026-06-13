const fs = require('fs').promises;
const path = require('path');
const logger = require('../logger');

class HashtagService {
  constructor() {
    this.hashtagLibraryPath = path.join(__dirname, '../../data/hashtags.json');
    this.hashtagLibrary = null;
  }

  /**
   * Load hashtag library from file
   */
  async loadHashtagLibrary() {
    try {
      if (!this.hashtagLibrary) {
        const data = await fs.readFile(this.hashtagLibraryPath, 'utf8');
        this.hashtagLibrary = JSON.parse(data);
        logger.info('Hashtag library loaded');
      }
      return this.hashtagLibrary;
    } catch (error) {
      logger.error('Error loading hashtag library', { error: error.message });
      return { categories: {} };
    }
  }

  /**
   * Get hashtags by category
   * @param {string} category - Hashtag category
   * @param {number} count - Number of hashtags to return
   * @returns {Promise<Array<string>>} Array of hashtags
   */
  async getHashtagsByCategory(category, count = 5) {
    try {
      const library = await this.loadHashtagLibrary();
      const categoryHashtags = library.categories[category] || [];
      
      if (categoryHashtags.length === 0) {
        logger.warn('No hashtags found for category', { category });
        return [];
      }

      // Shuffle and return requested count
      return this.shuffleArray(categoryHashtags).slice(0, count);
    } catch (error) {
      logger.error('Error getting hashtags by category', { error: error.message, category });
      return [];
    }
  }

  /**
   * Get trending hashtags
   * @param {number} count - Number of hashtags
   * @returns {Promise<Array<string>>} Array of trending hashtags
   */
  async getTrendingHashtags(count = 5) {
    try {
      const library = await this.loadHashtagLibrary();
      const trending = library.trending || [];
      return trending.slice(0, count);
    } catch (error) {
      logger.error('Error getting trending hashtags', { error: error.message });
      return [];
    }
  }

  /**
   * Mix hashtags from different categories
   * @param {Array<string>} categories - Categories to include
   * @param {number} count - Total number of hashtags
   * @returns {Promise<Array<string>>} Mixed hashtags
   */
  async getMixedHashtags(categories = ['ai', 'tools', 'productivity'], count = 12) {
    try {
      const hashtags = [];
      const perCategory = Math.floor(count / categories.length);
      const remainder = count % categories.length;

      for (let i = 0; i < categories.length; i++) {
        const categoryCount = perCategory + (i < remainder ? 1 : 0);
        const categoryHashtags = await this.getHashtagsByCategory(categories[i], categoryCount);
        hashtags.push(...categoryHashtags);
      }

      return hashtags.slice(0, count);
    } catch (error) {
      logger.error('Error getting mixed hashtags', { error: error.message });
      return [];
    }
  }

  /**
   * Get niche hashtags for specific topics
   * @param {Array<string>} topics - Topics/keywords
   * @returns {Promise<Array<string>>} Niche hashtags
   */
  async getNicheHashtags(topics = [], count = 5) {
    try {
      const library = await this.loadHashtagLibrary();
      const niche = library.niche || {};
      const hashtags = [];

      for (const topic of topics) {
        if (niche[topic]) {
          hashtags.push(...niche[topic]);
        }
      }

      return this.shuffleArray(hashtags).slice(0, count);
    } catch (error) {
      logger.error('Error getting niche hashtags', { error: error.message });
      return [];
    }
  }

  /**
   * Combine hashtags from multiple sources
   * @param {object} options - Options for hashtag generation
   * @returns {Promise<Array<string>>} Combined hashtags
   */
  async getOptimizedHashtags(options = {}) {
    try {
      const {
        categories = ['ai', 'tools'],
        niches = [],
        count = 12,
        includeTrending = true
      } = options;

      const hashtags = new Set();

      // Add trending hashtags
      if (includeTrending) {
        const trending = await this.getTrendingHashtags(Math.ceil(count * 0.2));
        trending.forEach(tag => hashtags.add(tag));
      }

      // Add category hashtags
      const categoryHashtags = await this.getMixedHashtags(categories, Math.ceil(count * 0.5));
      categoryHashtags.forEach(tag => hashtags.add(tag));

      // Add niche hashtags
      if (niches.length > 0) {
        const nicheHashtags = await this.getNicheHashtags(niches, Math.ceil(count * 0.3));
        nicheHashtags.forEach(tag => hashtags.add(tag));
      }

      const result = Array.from(hashtags).slice(0, count);
      logger.info('Optimized hashtags generated', { count: result.length });
      return result;
    } catch (error) {
      logger.error('Error getting optimized hashtags', { error: error.message });
      return [];
    }
  }

  /**
   * Utility function to shuffle array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = HashtagService;
