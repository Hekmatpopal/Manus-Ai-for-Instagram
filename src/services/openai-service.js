const { OpenAI } = require('openai');
const config = require('../config');
const logger = require('../logger');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey
    });
  }

  /**
   * Generate a caption for Instagram
   * @param {string} query - The content query/topic
   * @param {object} options - Additional options
   * @returns {Promise<string>} Generated caption
   */
  async generateCaption(query, options = {}) {
    try {
      const {
        tone = 'engaging',
        style = 'casual',
        length = 'medium' // short, medium, long
      } = options;

      const lengthGuide = {
        short: '50-100 words',
        medium: '100-200 words',
        long: '200-300 words'
      };

      const prompt = `Generate an Instagram caption about "${query}".

Requirements:
- Tone: ${tone}
- Style: ${style}
- Length: ${lengthGuide[length]}
- Include call-to-action
- Make it engaging and relevant to AI tools/tips
- Do NOT include hashtags in the caption
- Include emojis where appropriate

Caption:`;

      const response = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert Instagram content creator specializing in AI tools and tips. Create engaging, concise captions that drive engagement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: config.openai.temperature,
        max_tokens: config.openai.maxTokens
      });

      const caption = response.choices[0].message.content.trim();
      logger.info('Caption generated successfully', { query });
      return caption;
    } catch (error) {
      logger.error('Error generating caption', { error: error.message, query });
      throw error;
    }
  }

  /**
   * Generate hashtags for a post
   * @param {string} topic - The topic/content
   * @param {number} count - Number of hashtags to generate
   * @returns {Promise<Array<string>>} Array of hashtags
   */
  async generateHashtags(topic, count = 10) {
    try {
      const prompt = `Generate exactly ${count} relevant hashtags for an Instagram post about: "${topic}"

Requirements:
- Related to AI tools, tips, and tricks
- Mix of popular and niche hashtags
- No spaces in hashtags
- Include the # symbol
- Return only hashtags, one per line, no explanations`;

      const response = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert in Instagram hashtag strategy. Generate relevant, trending hashtags.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 200
      });

      const hashtags = response.choices[0].message.content
        .split('\n')
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#') && tag.length > 1);

      logger.info('Hashtags generated', { topic, count: hashtags.length });
      return hashtags.slice(0, count);
    } catch (error) {
      logger.error('Error generating hashtags', { error: error.message, topic });
      throw error;
    }
  }

  /**
   * Generate a complete Instagram post
   * @param {string} query - The content query
   * @param {object} options - Options for generation
   * @returns {Promise<object>} Post object with caption and hashtags
   */
  async generatePost(query, options = {}) {
    try {
      const {
        tone = 'engaging',
        style = 'casual',
        hashtagCount = 12
      } = options;

      const [caption, hashtags] = await Promise.all([
        this.generateCaption(query, { tone, style }),
        this.generateHashtags(query, hashtagCount)
      ]);

      const post = {
        caption,
        hashtags,
        topic: query,
        generatedAt: new Date().toISOString()
      };

      logger.info('Post generated successfully', { query });
      return post;
    } catch (error) {
      logger.error('Error generating post', { error: error.message, query });
      throw error;
    }
  }

  /**
   * Generate content ideas
   * @param {string} theme - Content theme
   * @param {number} count - Number of ideas to generate
   * @returns {Promise<Array<string>>} Array of content ideas
   */
  async generateContentIdeas(theme, count = 5) {
    try {
      const prompt = `Generate ${count} creative content ideas about "${theme}" for an Instagram account focused on AI tools and tips.

Return only the ideas, one per line, without numbering or bullet points.`;

      const response = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative Instagram content strategist specializing in AI and technology.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      const ideas = response.choices[0].message.content
        .split('\n')
        .map(idea => idea.trim())
        .filter(idea => idea.length > 0);

      logger.info('Content ideas generated', { theme, count: ideas.length });
      return ideas.slice(0, count);
    } catch (error) {
      logger.error('Error generating content ideas', { error: error.message, theme });
      throw error;
    }
  }
}

module.exports = OpenAIService;
