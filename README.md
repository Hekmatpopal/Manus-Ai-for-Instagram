# 🤖 Manus AI - Instagram Content Generator

An intelligent AI-powered system that generates engaging Instagram content (captions, prompts, graphics, and videos) tailored for **AI tools, tips, and tricks**.

## ✨ Features

- ✅ **AI Caption Generation**: Create engaging Instagram captions using ChatGPT
- ✅ **Template-Based Content**: Pre-designed templates for consistent branding
- ✅ **Tool Database**: 50+ AI tools with features and use cases
- ✅ **Smart Hashtag Selection**: Context-aware hashtag optimization
- ✅ **Image Integration**: Fetch royalty-free images automatically
- ✅ **Design Creation**: Generate graphics using Canva API
- ✅ **Batch Processing**: Generate multiple posts for content calendar
- ✅ **Instagram Publishing**: Direct posting to Instagram

## 📋 Project Structure

```
manus-ai/
├── README.md                          # Project overview
├── package.json                       # Node.js dependencies
├── .env.example                       # Environment variables template
├── .gitignore                         # Files to ignore
│
├── /src
│   ├── index.js                       # Main entry point
│   ├── config.js                      # Configuration
│   └── /services
│       ├── openai-service.js          # ChatGPT integration
│       ├── canva-service.js           # Canva integration
│       ├── instagram-service.js       # Instagram API
│       └── hashtag-service.js         # Hashtag generation
│
├── /data
│   ├── ai-tools.json                  # AI tools database
│   ├── caption-templates.json         # Caption templates
│   ├── hashtags.json                  # Hashtag library
│   └── content-ideas.json             # Content idea templates
│
├── /tests
│   ├── openai-service.test.js
│   └── caption-generator.test.js
│
├── /docs
│   ├── SETUP.md                       # Setup instructions
│   ├── API-INTEGRATION.md             # API docs
│   └── USAGE.md                       # How to use
│
└── /examples
    ├── generate-caption.js            # Example usage
    └── batch-posts.js                 # Batch generation example
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **npm** or **yarn**
- **API Keys** for:
  - OpenAI (ChatGPT)
  - Canva (optional, for design generation)
  - Unsplash or Pexels (for images)
  - Instagram Graph API (optional, for posting)

### Installation

```bash
# Clone repository
git clone https://github.com/Hekmatpopal/Manus-Ai-for-Instagram.git
cd Manus-Ai-for-Instagram

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env file
nano .env
```

### Configuration

Edit `.env` with your API keys:

```env
# OpenAI (ChatGPT)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxx

# Canva (optional)
CANVA_API_KEY=your_canva_key

# Image APIs (choose one or both)
UNSPLASH_API_KEY=your_unsplash_key
PEXELS_API_KEY=your_pexels_key

# Instagram (optional)
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id

# Environment
NODE_ENV=development
```

### Basic Usage

```javascript
const ManusAI = require('./src/index.js');

// Initialize Manus AI
const manus = new ManusAI();

// Generate a single Instagram post
const post = await manus.generatePost({
  query: "Create a carousel about top 5 AI tools",
  type: "carousel",
  tone: "enthusiastic"
});

console.log("Caption:", post.caption);
console.log("Image URL:", post.imageUrl);
console.log("Hashtags:", post.hashtags);

// Generate batch posts for a week
const weekPosts = await manus.generateBatchPosts(7);
console.log("Generated 7 posts for the week!");
```

## 📚 Supported AI Tools

Manus AI has knowledge of 50+ AI tools including:

### **Text Generation**
- ChatGPT
- Writesonic
- Rytr
- Copy.ai

### **Image Generation**
- Canva
- Craiyon
- Stable Diffusion
- Midjourney

### **Video Creation**
- Pictory
- Runway ML
- Kapwing
- InVideo

### **And More...**
See [ai-tools.json](./data/ai-tools.json) for complete list

## 🎯 Content Types

Manus AI can generate:

- ✅ AI Tool Spotlights
- ✅ Prompt Engineering Tips
- ✅ Productivity Hacks
- ✅ Tool Comparisons
- ✅ Before & After Stories
- ✅ Daily AI Tips
- ✅ Carousel Posts (5-7 slides)
- ✅ Reel Scripts & Ideas
- ✅ Story Ideas & Sequences

## 🔌 API Integrations

- **OpenAI API** - Text generation
- **Canva API** - Graphics creation
- **Unsplash API** - Stock images
- **Pexels API** - Royalty-free images
- **Instagram Graph API** - Direct posting
- **Wordnik API** - Word variations

See [API-INTEGRATION.md](./docs/API-INTEGRATION.md) for detailed setup.

## 📖 Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed installation steps
- [API Integration](./docs/API-INTEGRATION.md) - API configuration guide
- [Usage Examples](./docs/USAGE.md) - Code examples and tutorials

## 💡 Example Workflows

### Generate Caption Only
```javascript
const caption = await manus.generateCaption("AI tool spotlight");
```

### Generate Caption + Image
```javascript
const post = await manus.generatePost("AI productivity hack");
```

### Batch Generate Weekly Content
```javascript
const weeklyPosts = await manus.generateBatchPosts(7);
for (const post of weeklyPosts) {
  console.log(post.caption);
}
```

### Post Directly to Instagram
```javascript
await manus.postToInstagram({
  caption: "Your caption here",
  imageUrl: "your-image-url",
  hashtags: ["#AITips", "#Tools"]
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- openai-service.test.js

# Run with coverage
npm test -- --coverage
```

## 🔄 Workflow

1. **Input**: Provide a query or select a content type
2. **Processing**: Manus AI processes your request using AI tools database and templates
3. **Generation**: Creates caption, selects images, generates hashtags
4. **Output**: Returns complete Instagram post ready to publish
5. **Optional**: Automatically posts to Instagram

## 📊 Available Commands

```bash
# Start development server
npm start

# Generate a single post
npm run generate:post

# Generate batch posts
npm run generate:batch

# Test API connections
npm run test:apis

# Build for production
npm run build
```

## 🐛 Troubleshooting

### API Key Issues
- Verify all API keys in `.env` file
- Check API key permissions and expiration dates
- Run `npm run test:apis` to validate connections

### Generation Issues
- Check internet connection
- Verify API rate limits
- Review error logs in console

### Instagram Posting Issues
- Verify Instagram Business Account is set up
- Check access token hasn't expired
- Ensure proper permissions are set

See [SETUP.md](./docs/SETUP.md) for detailed troubleshooting.

## 🔄 Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📈 Roadmap

- [ ] Direct Instagram Story posting
- [ ] TikTok content generation
- [ ] LinkedIn post optimization
- [ ] Analytics & performance tracking
- [ ] Web UI dashboard
- [ ] Mobile app
- [ ] AI-powered image generation
- [ ] Video reel generation with editing

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details

## 👨‍💻 Author

**Hekmatpopal** - AI Content Creator & Developer

## 🤝 Support & Connect

- 📧 Email: your-email@example.com
- 🐦 Twitter: [@yourhandle](https://twitter.com/yourhandle)
- 📱 Instagram: [@youraccount](https://instagram.com/youraccount)
- 💬 GitHub Issues: [Report a bug](https://github.com/Hekmatpopal/Manus-Ai-for-Instagram/issues)

## ⭐ Show Your Support

If you find this project helpful:
- ⭐ Star this repository
- 🔗 Share with your network
- 💬 Provide feedback
- 🤝 Contribute improvements

---

**Made with ❤️ by Hekmatpopal**

**Last Updated**: June 2026
