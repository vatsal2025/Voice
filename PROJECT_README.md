# Voice Web Controller - Complete System

A production-ready voice-controlled web interaction system consisting of a powerful backend API and a browser extension frontend that enables users to control any website using natural language voice commands powered by AI.

## 🚀 Project Overview

This project implements a complete voice-based web interaction system with:

- **Backend API**: Node.js/Express server with Groq AI integration for intent processing
- **Browser Extension**: Chrome/Firefox extension with React-based popup and vanilla JS content scripts
- **Real-time Processing**: Live speech-to-text with AI-powered command understanding
- **Universal Compatibility**: Works on any website without modification

## 📁 Project Structure

```
Voice/
├── 📁 backend/
│   ├── 📁 services/           # Core business logic services
│   │   ├── intentService.js   # AI-powered intent processing
│   │   ├── commandService.js  # Command execution logic
│   │   ├── contextService.js  # Page context management
│   │   └── speechService.js   # Speech processing services
│   ├── 📁 routes/             # API route handlers
│   │   ├── intent.js         # Intent analysis endpoints
│   │   ├── commands.js       # Command execution endpoints
│   │   ├── context.js        # Context management endpoints
│   │   └── speech.js         # Speech processing endpoints
│   ├── 📁 middleware/         # Express middleware
│   │   └── validation.js     # Request validation & security
│   ├── server.js              # Main server entry point
│   ├── healthcheck.js         # Health monitoring
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment configuration
│   └── Dockerfile            # Container deployment
├── 📁 frontend/               # Browser extension
│   ├── 📁 src/
│   │   ├── 📁 content/        # Content script (injected into pages)
│   │   │   └── content-script.js
│   │   ├── 📁 popup/          # Extension popup interface
│   │   │   ├── popup.html
│   │   │   ├── popup.css
│   │   │   └── popup.js
│   │   ├── 📁 background/     # Service worker
│   │   │   └── background.js
│   │   └── 📁 services/       # Frontend API services
│   ├── 📁 public/             # Static assets
│   │   ├── manifest.json      # Extension manifest
│   │   ├── icon-*.png         # Extension icons
│   │   └── content-styles.css # Injected styles
│   ├── 📁 dist/               # Built extension (generated)
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Build configuration
├── readme.md                  # API documentation
├── voice_web_task_breakdown_json.json  # Development roadmap
└── PROJECT_README.md          # This file
```

## 🛠 Installation & Setup

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd Voice
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your API keys:
   # GROQ_API_KEY=your_groq_api_key_here
   # ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

3. **Start Development Server**
   ```bash
   # Using environment variables (PowerShell)
   $env:GROQ_API_KEY="your_key"; $env:ELEVENLABS_API_KEY="your_key"; npm start
   
   # Or with proper .env loading
   npm run dev
   ```

4. **Verify Backend**
   ```bash
   curl http://localhost:3000/health
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Build Extension**
   ```bash
   npm run build
   ```

3. **Load Extension in Browser**
   - Open Chrome/Edge and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `frontend/dist/` directory
   - The extension should now appear in your browser toolbar

## 🎯 Features Implemented

### Backend API Features
- ✅ **AI-Powered Intent Processing**: Using Groq's Llama model for natural language understanding
- ✅ **Context-Aware Commands**: Analyzes page structure for intelligent command interpretation
- ✅ **Session Management**: Maintains user sessions and command history
- ✅ **Speech Services**: Text-to-speech with ElevenLabs integration
- ✅ **Robust Error Handling**: Comprehensive error handling and validation
- ✅ **Rate Limiting**: Configurable request throttling and security
- ✅ **CORS Support**: Configured for browser extension compatibility

### Frontend Extension Features
- ✅ **Floating Voice Button**: Always-accessible voice control interface
- ✅ **Speech Recognition**: Web Speech API integration for voice input
- ✅ **Voice Command Overlay**: Real-time feedback during command processing
- ✅ **Popup Interface**: Rich settings and command management UI
- ✅ **Context Analysis**: Automatic page structure analysis
- ✅ **Keyboard Shortcuts**: Ctrl+Shift+V for quick voice activation
- ✅ **Settings Management**: Persistent user preferences
- ✅ **Visual Feedback**: Element highlighting and status indicators

### Command Types Supported
- ✅ **Navigation**: "scroll down", "go back", "refresh page"
- ✅ **Clicking**: "click on sign in", "press submit button"
- ✅ **Form Filling**: "fill email with john@example.com"
- ✅ **Searching**: "search for laptops", "find contact information"
- ✅ **Page Control**: "scroll to top", "go to bottom"

## 🚀 Usage Examples

### Basic Voice Commands
```javascript
// Navigation
"Scroll down"
"Go back to previous page"
"Refresh the page"
"Go to the top"

// Interaction
"Click on sign in button"
"Press the submit button"
"Click on first result"

// Form Filling
"Fill email with user@example.com"
"Enter password as mypassword"
"Select option from dropdown"

// Search
"Search for wireless headphones"
"Find contact information"
"Look for pricing"
```

### API Usage Examples
```javascript
// Analyze voice command
const response = await fetch('/api/intent/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "click on the login button",
    context: {
      url: "https://example.com",
      availableElements: [...]
    },
    sessionId: "uuid-session-id"
  })
});

// Execute command
const response = await fetch('/api/commands/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intent: {
      action: "click",
      target: { selector: "#login-btn" },
      parameters: {}
    },
    context: { url: "https://example.com" }
  })
});
```

## 🏗 Architecture Overview

### Data Flow
1. **User speaks command** → Voice button captures audio
2. **Speech-to-text** → Web Speech API converts to text
3. **Intent Analysis** → Backend AI processes natural language
4. **Command Execution** → Frontend executes DOM manipulation
5. **Visual Feedback** → User sees command result with highlighting

### Backend Services
- **IntentService**: Groq AI integration for command understanding
- **CommandService**: Structured command execution with retry logic
- **ContextService**: Page analysis and session management
- **SpeechService**: ElevenLabs TTS and audio processing

### Frontend Components
- **Content Script**: Injected into all web pages for DOM control
- **Popup Interface**: Settings, status, and quick commands
- **Background Service**: Extension lifecycle and API communication
- **Voice Controller**: Main voice recognition and processing logic

## 🔧 Configuration

### Environment Variables
```bash
# Server
PORT=3000
NODE_ENV=development

# APIs
GROQ_API_KEY=your_groq_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# CORS
ALLOWED_ORIGINS=chrome-extension://,moz-extension://,http://localhost:3000
```

### Extension Settings
- **Enable Shortcuts**: Toggle keyboard shortcuts (Ctrl+Shift+V)
- **Show Button**: Display floating voice button on pages
- **Language**: Voice recognition language (en-US, en-GB, etc.)
- **Debug Mode**: Enable detailed console logging

## 🧪 Testing

### Backend Testing
```bash
# Health check
curl http://localhost:3000/health

# Test intent analysis
curl -X POST http://localhost:3000/api/intent/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"scroll down","context":{"url":"https://example.com"}}'

# Test capabilities
curl http://localhost:3000/api/intent/capabilities
```

### Extension Testing
1. Load extension in Chrome Developer Mode
2. Navigate to any website (e.g., google.com)
3. Click the floating voice button or press Ctrl+Shift+V
4. Say "scroll down" or "search for cats"
5. Observe command execution and visual feedback

### Supported Test Sites
- ✅ Google.com (search functionality)
- ✅ Amazon.com (product search, navigation)
- ✅ GitHub.com (repository navigation)
- ✅ Wikipedia.org (content reading, scrolling)
- ✅ Any standard website with forms and buttons

## 🚨 Troubleshooting

### Backend Issues
```bash
# GROQ API Key Error
Error: The GROQ_API_KEY environment variable is missing
Solution: Set environment variables or update .env file

# Port Already in Use
Error: listen EADDRINUSE :::3000
Solution: Kill process using port 3000 or change PORT in .env

# CORS Errors
Error: Cross-origin request blocked
Solution: Check ALLOWED_ORIGINS in .env includes your extension ID
```

### Extension Issues
```bash
# Speech Recognition Not Working
- Check microphone permissions in browser
- Ensure HTTPS or localhost (required for Web Speech API)
- Try different browser (Chrome recommended)

# Extension Not Loading
- Check Chrome://extensions for errors
- Rebuild extension: npm run build
- Reload extension in browser

# Backend Connection Failed
- Ensure backend is running on port 3000
- Check browser console for CORS/network errors
- Verify API endpoint URLs in extension code
```

## 📈 Performance Optimization

### Backend Performance
- ✅ Response caching for page analysis
- ✅ Connection pooling for API requests
- ✅ Request compression (gzip)
- ✅ Memory-efficient session management
- ✅ Async processing for all endpoints

### Frontend Performance
- ✅ Lazy loading of extension components
- ✅ Efficient DOM manipulation
- ✅ Minimal memory footprint (<50MB)
- ✅ Fast speech recognition with interim results
- ✅ Optimized build with Vite

## 🔐 Security Features

- ✅ **Input Validation**: Joi schema validation on all endpoints
- ✅ **Rate Limiting**: Configurable request throttling
- ✅ **CORS Protection**: Restricted to extension origins only
- ✅ **Request Sanitization**: XSS and injection prevention
- ✅ **Secure Headers**: Helmet.js security middleware
- ✅ **Error Handling**: No data leakage in error responses

## 🚀 Deployment Options

### Backend Deployment
```bash
# Docker
docker build -t voice-web-backend .
docker run -d -p 3000:3000 \
  -e GROQ_API_KEY=your_key \
  -e ELEVENLABS_API_KEY=your_key \
  voice-web-backend

# Railway
railway login
railway init
railway add --service postgresql
railway deploy

# Vercel
vercel --prod
```

### Extension Distribution
```bash
# Build for production
npm run build

# Package for Chrome Web Store
npm run pack

# Upload to Chrome Web Store Developer Dashboard
# Upload to Firefox Add-ons (AMO)
```

## 🎯 Future Enhancements

### Planned Features
- [ ] **Multi-language Support**: Additional voice recognition languages
- [ ] **Custom Commands**: User-defined voice shortcuts
- [ ] **Visual Recognition**: Screen element identification via AI
- [ ] **Workflow Automation**: Multi-step command sequences
- [ ] **Analytics Dashboard**: Usage statistics and insights
- [ ] **Mobile Support**: Progressive Web App version
- [ ] **Offline Mode**: Local command processing capabilities

### Technical Improvements
- [ ] **Database Integration**: Persistent storage with PostgreSQL
- [ ] **Caching Layer**: Redis for performance optimization
- [ ] **Load Balancing**: Multiple backend instances
- [ ] **Real-time Updates**: WebSocket communication
- [ ] **Advanced Analytics**: User behavior tracking
- [ ] **A/B Testing**: Feature experimentation framework

## 📄 API Documentation

Full API documentation is available in `readme.md` including:
- Detailed endpoint specifications
- Request/response examples
- Authentication requirements
- Rate limiting information
- Error handling documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration for code style
- Write comprehensive tests for new features
- Update documentation for API changes
- Use semantic versioning for releases
- Follow the established project structure

## 📊 System Requirements

### Backend Requirements
- Node.js 18+ 
- npm 8+
- 2GB RAM minimum
- Groq API access
- ElevenLabs API access (optional)

### Browser Requirements
- Chrome 88+ / Firefox 85+ / Edge 88+
- Microphone permissions
- HTTPS or localhost for Speech API
- 50MB available memory

## 📞 Support

For questions, issues, or contributions:

1. **GitHub Issues**: Report bugs and feature requests
2. **Documentation**: Check API docs and README files
3. **Development**: Follow the task breakdown JSON for roadmap
4. **Community**: Join discussions in repository

## 🏆 Credits

Built with modern technologies:
- **Backend**: Node.js, Express, Groq AI, ElevenLabs
- **Frontend**: Vanilla JS, Web Speech API, Chrome Extension APIs
- **Build Tools**: Vite, npm, Docker
- **AI Services**: Groq Llama 3 model for intent processing

---

**Built with ❤️ for universal web accessibility through voice interaction**

*This project demonstrates a complete production-ready implementation of AI-powered voice web control with comprehensive backend services and a polished browser extension frontend.*
