import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

export async function generateImage(prompt: string, style: string): Promise<string> {
  try {
    // Use DALL-E 3 for AI image generation
    if (OPENAI_API_KEY) {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'dall-e-3',
          prompt: `${prompt}. Style: ${style}. Professional Instagram post format.`,
          n: 1,
          size: '1024x1024',
          quality: 'hd',
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      if (response.data.data && response.data.data[0]) {
        return response.data.data[0].url;
      }
    }

    // Fallback to Unsplash if DALL-E fails
    if (UNSPLASH_API_KEY) {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: prompt,
          per_page: 1,
          orientation: 'square',
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
        },
      });

      if (response.data.results && response.data.results[0]) {
        return response.data.results[0].urls.regular;
      }
    }

    throw new Error('No image service available');
  } catch (error) {
    console.error('Image generation error:', error);
    // Return a placeholder image if generation fails
    return 'https://via.placeholder.com/1024x1024?text=Image+Generation+Failed';
  }
}
