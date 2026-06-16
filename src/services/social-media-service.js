const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const { APIError, ValidationError, retryWithBackoff } = require('../utils/error-handler');

class SocialMediaService {
  constructor() {
    this.platforms = config.platforms;
  }

  /**
   * Post to Instagram
   */
  async postToInstagram(params) {
    const { caption, imageUrl, hashtags = [], scheduledDate = null } = params;

    if (!caption || !imageUrl) {
      throw new ValidationError('Caption and imageUrl are required');
    }

    if (!this.platforms.instagram.enabled) {
      logger.warn('Instagram posting disabled - no access token configured');
      return {
        success: false,
        message: 'Instagram API not configured. Configure INSTAGRAM_ACCESS_TOKEN in .env',
        post: { caption, imageUrl, hashtags },
      };
    }

    const fullCaption = this._buildCaption(caption, hashtags);

    return retryWithBackoff(async () => {
      try {
        // Step 1: Upload image container
        const containerResponse = await axios.post(
          `https://graph.instagram.com/v${this.platforms.instagram.apiVersion}/${this.platforms.instagram.businessAccountId}/media`,
          {
            image_url: imageUrl,
            caption: fullCaption,
            ...(scheduledDate && { scheduled_publish_time: new Date(scheduledDate).getTime() / 1000 }),
          },
          {
            params: {
              access_token: this.platforms.instagram.accessToken,
            },
          }
        );

        const mediaId = containerResponse.data.id;

        // Step 2: Publish (if not scheduled)
        if (!scheduledDate) {
          await axios.post(
            `https://graph.instagram.com/v${this.platforms.instagram.apiVersion}/${mediaId}/publish`,
            {},
            {
              params: {
                access_token: this.platforms.instagram.accessToken,
              },
            }
          );
        }

        logger.info('Post published to Instagram', { mediaId, scheduled: !!scheduledDate });
        return {
          success: true,
          platform: 'instagram',
          mediaId,
          message: scheduledDate ? 'Post scheduled for Instagram' : 'Post published to Instagram',
        };
      } catch (error) {
        if (error.response?.status === 401) {
          throw new APIError('Invalid Instagram access token', 'Instagram');
        }
        if (error.response?.status === 429) {
          throw new RateLimitError('Instagram', 60);
        }
        throw new APIError(error.message, 'Instagram', error);
      }
    });
  }

  /**
   * Post to TikTok
   */
  async postToTikTok(params) {
    const { caption, videoUrl, hashtags = [], scheduledDate = null } = params;

    if (!caption || !videoUrl) {
      throw new ValidationError('Caption and videoUrl are required for TikTok');
    }

    if (!this.platforms.tiktok.enabled) {
      logger.warn('TikTok posting disabled - no access token configured');
      return {
        success: false,
        message: 'TikTok API not configured. Requires business account and access token',
        post: { caption, videoUrl, hashtags },
      };
    }

    const fullCaption = this._buildCaption(caption, hashtags);

    return retryWithBackoff(async () => {
      try {
        const response = await axios.post(
          `https://open.tiktok.com/v1/video/upload/`,
          {
            video_url: videoUrl,
            description: fullCaption,
            ...(scheduledDate && { schedule_time: new Date(scheduledDate).getTime() / 1000 }),
          },
          {
            headers: {
              Authorization: `Bearer ${this.platforms.tiktok.accessToken}`,
            },
          }
        );

        logger.info('Video uploaded to TikTok', { videoId: response.data.data?.video_id });
        return {
          success: true,
          platform: 'tiktok',
          videoId: response.data.data?.video_id,
          message: scheduledDate ? 'Video scheduled for TikTok' : 'Video uploaded to TikTok',
        };
      } catch (error) {
        if (error.response?.status === 401) {
          throw new APIError('Invalid TikTok access token', 'TikTok');
        }
        throw new APIError(error.message, 'TikTok', error);
      }
    });
  }

  /**
   * Post to YouTube
   */
  async postToYouTube(params) {
    const { title, description, videoUrl, tags = [], thumbnailUrl = null, visibility = 'public' } = params;

    if (!title || !description || !videoUrl) {
      throw new ValidationError('Title, description, and videoUrl are required for YouTube');
    }

    if (!this.platforms.youtube.enabled) {
      logger.warn('YouTube posting disabled - no API key configured');
      return {
        success: false,
        message: 'YouTube API not configured. Configure YOUTUBE_API_KEY in .env',
        post: { title, description, videoUrl, tags },
      };
    }

    return retryWithBackoff(async () => {
      try {
        const response = await axios.post(
          `https://www.googleapis.com/youtube/v3/videos`,
          {
            snippet: {
              title,
              description,
              tags,
              categoryId: '27', // Education category
            },
            status: {
              privacyStatus: visibility,
              selfDeclaredMadeForKids: false,
            },
            fileUrl: videoUrl,
            thumbnail: thumbnailUrl,
          },
          {
            params: {
              part: 'snippet,status',
              key: this.platforms.youtube.apiKey,
            },
          }
        );

        logger.info('Video uploaded to YouTube', { videoId: response.data.id });
        return {
          success: true,
          platform: 'youtube',
          videoId: response.data.id,
          message: `Video uploaded to YouTube (${visibility})`,
        };
      } catch (error) {
        if (error.response?.status === 401) {
          throw new APIError('Invalid YouTube API key', 'YouTube');
        }
        throw new APIError(error.message, 'YouTube', error);
      }
    });
  }

  /**
   * Post to multiple platforms
   */
  async postToMultiplePlatforms(platforms, content) {
    const results = [];

    for (const platform of platforms) {
      try {
        let result;
        switch (platform.toLowerCase()) {
          case 'instagram':
            result = await this.postToInstagram(content.instagram || content);
            break;
          case 'tiktok':
            result = await this.postToTikTok(content.tiktok || content);
            break;
          case 'youtube':
            result = await this.postToYouTube(content.youtube || content);
            break;
          default:
            logger.warn(`Unknown platform: ${platform}`);
            continue;
        }
        results.push(result);
      } catch (error) {
        logger.error(`Failed to post to ${platform}:`, error);
        results.push({
          success: false,
          platform,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Build caption with hashtags
   */
  _buildCaption(caption, hashtags = []) {
    if (!hashtags || hashtags.length === 0) {
      return caption;
    }

    const hashtagString = hashtags
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
      .join(' ');

    return `${caption}\n\n${hashtagString}`;
  }

  /**
   * Get posting guidelines for platform
   */
  getPostingGuidelines(platform) {
    const guidelines = {
      instagram: {
        maxCharacters: 2200,
        maxHashtags: 30,
        imageSizes: ['1080x1350', '1080x1080', '1440x1440'],
        bestTimes: ['6-9 AM', '12-1 PM', '5-7 PM'],
        contentTypes: ['feed', 'carousel', 'reel', 'story'],
      },
      tiktok: {
        maxCharacters: 150,
        maxHashtags: 10,
        videoLength: '15 seconds - 10 minutes',
        bestTimes: '8-10 AM, 6-8 PM',
        aspectRatio: '9:16',
      },
      youtube: {
        maxCharacters: 5000,
        maxTags: 500,
        videoLength: 'No limit',
        bestTimes: 'Tuesday-Thursday, 2-4 PM',
        minVideoLength: '1 second',
      },
    };

    return guidelines[platform.toLowerCase()] || null;
  }
}

module.exports = SocialMediaService;
