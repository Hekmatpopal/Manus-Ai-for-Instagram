import axios from 'axios';
import { GenerateContentRequest, Content } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function generateContent(request: GenerateContentRequest): Promise<Content> {
  const response = await api.post('/api/generate', request);
  return response.data;
}

export async function generateImage(prompt: string, style: string): Promise<string> {
  const response = await api.post('/api/generate-image', { prompt, style });
  return response.data.imageUrl;
}

export async function getTemplates() {
  const response = await api.get('/api/templates');
  return response.data;
}

export async function schedulePost(content: Content, scheduledDate: string) {
  const response = await api.post('/api/schedule', { content, scheduledDate });
  return response.data;
}

export async function postToInstagram(content: Content) {
  const response = await api.post('/api/post-instagram', content);
  return response.data;
}
