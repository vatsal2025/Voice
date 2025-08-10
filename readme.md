# Voice Web Interaction Backend API

A robust backend API for the Voice-Based Web Interaction System that enables voice control of web pages through natural language processing and AI-powered intent recognition.

## 🚀 Features

- **Intent Processing**: AI-powered voice command understanding using Groq API
- **Speech Services**: Text-to-speech with ElevenLabs and speech-to-text capabilities  
- **Context Management**: Intelligent page analysis and session management
- **Command Execution**: Structured command processing with retry logic
- **Real-time Processing**: Streaming speech transcription support
- **Cross-Platform**: Designed for browser extension integration

## 📋 API Endpoints

### Intent Processing
- `POST /api/intent/analyze` - Analyze voice commands and return structured intents
- `POST /api/intent/batch-analyze` - Process multiple commands in batch
- `GET /api/intent/capabilities` - Get supported command capabilities
- `POST /api/intent/feedback` - Provide feedback on intent analysis

### Command Execution  
- `POST /api/commands/execute` - Execute processed commands on webpages
- `POST /api/commands/queue` - Queue multiple commands for execution
- `GET /api/commands/status/:id` - Get command execution status
- `DELETE /api/commands/cancel/:id` - Cancel pending commands

### Context Management
- `POST /api/context` - Update session context with page information
- `GET /api/context/:sessionId` - Retrieve session context and history
- `POST /api/context/analyze-page` - Analyze page structure
- `GET /api/context/:sessionId/suggestions` - Get contextual suggestions

### Speech Services
- `POST /api/speech/transcribe` - Convert speech to text
- `POST /api/speech/text-to-speech` - Convert text to speech using ElevenLabs
- `POST /api/speech/stream-transcribe` - Real-time speech transcription
- `GET /api/speech/voices` - Get available TTS voices

## 🛠 Installation

### Prerequisites
- Node.js 18+ 
- npm 8+
- Groq API key
- ElevenLabs API key (optional)

### Local Development

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd voice-web-backend
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your API keys:
GROQ_API_KEY=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
ELEVENLABS_API_KEY=sk_04617a68612714b888c89b3f71be67ca12218a20e13b9a07
```

3. **Start the development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Production Deployment

#### Docker Deployment
```bash
# Build image
docker build -t voice-web-backend .

# Run container
docker run -d \
  --name voice-web-api \
  -p 3000:3000 \
  -e GROQ_API_KEY=your_groq_key \
  -e ELEVENLABS_API_KEY=your_elevenlabs_key \
  voice-web-backend
```

#### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically with git push

#### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# API Keys  
GROQ_API_KEY=your_groq_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# CORS Origins
ALLOWED_ORIGINS=chrome-extension://,moz-extension://,http://localhost:3000
```

### API Rate Limits
- Default: 1000 requests per 15 minutes per IP
- Configurable via environment variables
- Separate limits for different endpoint types

## 📖 Usage Examples

### Analyze Voice Command
```javascript
const response = await fetch('/api/intent/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "scroll down the page",
    context: {
      url: "https://example.com",
      availableElements: [...]
    },
    sessionId: "uuid-session-id"
  })
});

const result = await response.json();
console.log(result.data.intent); // Structured command intent
```

### Execute Command
```javascript
const response = await fetch('/api/commands/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intent: {
      action: "scroll",
      parameters: { direction: "down", amount: "viewport" }
    },
    context: {
      url: "https://example.com",
      sessionId: "uuid-session-id"
    }
  })
});
```

### Convert Text to Speech  
```javascript
const response = await fetch('/api/speech/text-to-speech', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Command executed successfully",
    voice: "rachel",
    format: "mp3"
  })
});

const audioBuffer = await response.arrayBuffer();
```

## 🏗 Architecture

### Core Services

#### IntentService
- Processes voice commands using Groq AI
- Handles natural language understanding
- Provides context-aware command interpretation
- Supports fallback parsing for common commands

#### CommandService  
- Executes structured commands with retry logic
- Manages command queuing and status tracking
- Provides execution validation and error handling
- Supports multi-step command workflows

#### ContextService
- Manages user sessions and page context
- Analyzes webpage structure and capabilities  
- Provides contextual command suggestions
- Tracks interaction history and preferences

#### SpeechService
- Text-to-speech via ElevenLabs API
- Speech-to-text transcription capabilities
- Real-time streaming speech processing
- Audio quality analysis and optimization

### Data Flow

1. **Voice Input** → Speech-to-text conversion
2. **Intent Analysis** → AI processes natural language  
3. **Context Enrichment** → Page analysis enhances commands
4. **Command Execution** → Structured actions sent to frontend
5. **Feedback Loop** → Results improve future processing

## 🔐 Security Features

- **Input Validation**: Joi schema validation on all endpoints
- **Rate Limiting**: Configurable request throttling
- **CORS Protection**: Browser extension and localhost origins
- **Request Sanitization**: XSS and injection prevention
- **API Key Validation**: Optional API key authentication
- **Error Handling**: Secure error responses without data leakage

## 🧪 Testing

### Run Tests
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test intent analysis
curl -X POST http://localhost:3000/api/intent/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"scroll down","context":{"url":"https://example.com"}}'
```

## 📊 Monitoring & Logging

### Health Check
- Endpoint: `GET /health`
- Returns server status, uptime, and environment info
- Used by Docker health checks and load balancers

### Request Logging  
- Comprehensive request/response logging
- Performance metrics tracking
- Error logging with stack traces
- Configurable log levels

### Usage Analytics
- Session-based usage tracking
- API endpoint usage statistics
- Speech service usage metrics
- Command execution success rates

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Human readable error message",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "details": {...}
}
```

### Error Types
- **Validation Errors** (400): Invalid request format
- **Authentication Errors** (401): Missing/invalid API keys  
- **Rate Limit Errors** (429): Too many requests
- **Server Errors** (500): Internal processing failures

## 📈 Performance Optimization

- **Response Caching**: Page analysis results cached
- **Connection Pooling**: Optimized API connections
- **Request Compression**: Gzip compression enabled
- **Memory Management**: Session cleanup and garbage collection
- **Async Processing**: Non-blocking request handling

## 🔄 Browser Extension Integration

### CORS Configuration
The API is configured to accept requests from browser extensions:

```javascript
// Allowed origins include:
// - chrome-extension://*
// - moz-extension://*  
// - http://localhost:* (development)
```

### Extension Communication
```javascript
// From browser extension content script:
const response = await fetch('http://localhost:3000/api/intent/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: transcribedText,
    context: {
      url: window.location.href,
      pageTitle: document.title,
      availableElements: extractedElements
    }
  })
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation for API changes
- Use semantic versioning for releases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**"GROQ_API_KEY not configured"**
- Ensure environment variable is set correctly
- Check .env file is not gitignored in production

**"Failed to transcribe audio"**  
- Verify audio format is supported (wav, mp3, ogg, webm)
- Check file size limits (max 10MB)

**"Command validation failed"**
- Review request body against API documentation
- Check required fields are present

### Getting Help
- 📧 Email: support@voiceweb.com
- 💬 Discord: [Voice Web Community](https://discord.gg/voiceweb)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📚 Docs: [Full Documentation](https://docs.voiceweb.com)

---

**Built with ❤️ for universal web accessibility through voice interaction**