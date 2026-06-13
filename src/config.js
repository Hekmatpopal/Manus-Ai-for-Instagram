require('dotenv').config();

const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  // API Keys
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 500
  },
  
  canva: {
    apiKey: process.env.CANVA_API_KEY
  },
  
  images: {
    unsplash: {
      apiKey: process.env.UNSPLASH_API_KEY,
      baseUrl: 'https://api.unsplash.com'
    },
    pexels: {
      apiKey: process.env.PEXELS_API_KEY,
      baseUrl: 'https://api.pexels.com/v1'
    }
  },
  
  instagram: {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
    apiVersion: 'v18.0'
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  
  // Content generation defaults
  contentDefaults: {
    maxHashtags: 15,
    minHashtags: 5,
    captionMaxLength: 2200,
    batchSize: 7
  }
};

// Validate required API keys
const validateConfig = () => {
  if (!config.openai.apiKey) {
    console.warn('⚠️  Warning: OPENAI_API_KEY not set');
  }
};

validateConfig();

module.exports = config;
