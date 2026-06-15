# Deployment Guide

## Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- API Keys for: OpenAI, Unsplash/Pexels, Instagram (optional)

### Local Development

```bash
# Install dependencies
cd server && npm install
cd ../frontend && npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run both services
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Visit http://localhost:3000
```

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up

# Visit http://localhost:3000
```

## Production Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Railway/Heroku)
1. Push to GitHub
2. Connect to Railway/Heroku
3. Set environment variables
4. Deploy

## Environment Variables

```env
OPENAI_API_KEY=your-key
UNSPLASH_API_KEY=your-key
INSTAGRAM_ACCESS_TOKEN=your-token
NEXT_PUBLIC_API_URL=production-backend-url
```

## Database (Optional)

For saving drafts and schedules, add MongoDB:

```bash
# Add to docker-compose.yml
mongo:
  image: mongo:5.0
  ports:
    - '27017:27017'
  volumes:
    - mongo-data:/data/db

volumes:
  mongo-data:
```
