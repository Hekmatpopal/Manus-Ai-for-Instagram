import express, { Router, Request, Response } from 'express';
import { generateCaption } from '../services/openai-service';
import { generateImage } from '../services/image-service';
import { getRelevantHashtags } from '../services/hashtag-service';
import { Content } from '../types';

const router = Router();

interface GenerateRequest extends Request {
  body: {
    topic: string;
    contentType: string;
    tone: string;
    style: string;
    includeImage: boolean;
  };
}

// POST /api/generate
router.post('/generate', async (req: GenerateRequest, res: Response) => {
  try {
    const { topic, contentType, tone, style, includeImage } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Generate caption
    const caption = await generateCaption(topic, contentType, tone);

    // Generate image if requested
    let imageUrl: string | undefined;
    if (includeImage) {
      imageUrl = await generateImage(`${topic} ${style}`, style);
    }

    // Get hashtags
    const hashtags = await getRelevantHashtags(topic, contentType);

    const content: Content = {
      id: `content-${Date.now()}`,
      caption,
      imageUrl,
      hashtags,
      type: contentType,
      tone,
      style,
      createdAt: new Date(),
    };

    res.json(content);
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// POST /api/generate-image
router.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const imageUrl = await generateImage(prompt, style);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// GET /api/templates
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const templates = [
      {
        id: '1',
        name: 'AI Tool Spotlight',
        description: 'Highlight a specific AI tool',
        template: 'Just discovered {tool}! It\'s perfect for {use_case}. Here\'s why:',
      },
      {
        id: '2',
        name: 'Quick Tip',
        description: 'Share a quick AI productivity tip',
        template: '💡 Pro tip: {tip}',
      },
      {
        id: '3',
        name: 'Top 5 List',
        description: 'Create a top 5 list post',
        template: '🔥 Top 5 {category}:\n1. {item1}\n2. {item2}\n3. {item3}\n4. {item4}\n5. {item5}',
      },
    ];
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// POST /api/schedule
router.post('/schedule', async (req: Request, res: Response) => {
  try {
    const { content, scheduledDate } = req.body;

    if (!scheduledDate) {
      return res.status(400).json({ error: 'Scheduled date is required' });
    }

    // TODO: Implement scheduling logic (save to database)
    res.json({ success: true, message: 'Post scheduled successfully', scheduledDate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule post' });
  }
});

// POST /api/post-instagram
router.post('/post-instagram', async (req: Request, res: Response) => {
  try {
    const { caption, imageUrl, hashtags } = req.body;

    if (!caption || !imageUrl) {
      return res.status(400).json({ error: 'Caption and image are required' });
    }

    // TODO: Implement Instagram API integration
    res.json({ success: true, message: 'Posted to Instagram', postUrl: '#' });
  } catch (error) {
    console.error('Instagram posting error:', error);
    res.status(500).json({ error: 'Failed to post to Instagram' });
  }
});

export default router;
