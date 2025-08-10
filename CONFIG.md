# Configuration Guide

This document explains the centralized configuration system for the Voice Web Interaction API.

## Overview

The API uses a centralized configuration loader that:
- **Validates** all environment variables on startup
- **Provides clear error messages** for missing required variables
- **Offers fallback values** for optional settings
- **Centralizes** all configuration in one place

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Groq API key** (required):
   ```env
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## Required Configuration

### GROQ_API_KEY (Required)

The Groq API key is **absolutely required** for the AI intent processing to work.

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**How to get your key:**
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create a new API key
3. Copy the key (starts with `gsk_`)

**⚠️ Without this key, the server will refuse to start!**

## Optional Configuration

### ElevenLabs Text-to-Speech

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_DEFAULT_VOICE=rachel
```

- **Optional** - The system will use fallback audio generation if not configured
- Get your key from [ElevenLabs Settings](https://elevenlabs.io/app/settings)

### Web Search API

```env
WEB_SEARCH_API_KEY=your_web_search_api_key_here
WEB_SEARCH_PROVIDER=google
```

- **Optional** - Enables enhanced web search functionality
- Without this, search features will have limited functionality

### Server Configuration

```env
PORT=3000
HOST=localhost
NODE_ENV=development
```

All server settings are optional with sensible defaults.

## Configuration Validation

The system validates your configuration on startup and provides helpful error messages:

### ✅ Success Message
```
✅ Configuration loaded successfully

📋 Configuration Status:
   🤖 Groq AI Service: ✅ Configured
   🎤 ElevenLabs TTS: ✅ Configured
   🔍 Web Search: ⚠️  Not configured (limited functionality)
   🌐 Server: Port 3000 (development mode)
   🛡️  Security: Rate limiting (1000 requests/15min)
   🔧 Features: Fallback=true, Debug=false
```

### ❌ Error Message
```
🚨 CONFIGURATION ERROR: Missing required environment variables

❌ GROQ_API_KEY
   Groq API key for AI intent processing

To fix this issue:
1. Create a .env file in your project root directory
2. Add the missing variables:

   GROQ_API_KEY=gsk_your_groq_api_key_here
   # Get your key from: https://console.groq.com/keys

3. Restart the server

Example .env file:
   GROQ_API_KEY=gsk_your_actual_key_here
   PORT=3000
   NODE_ENV=development
```

## Advanced Configuration

### API Timeouts

```env
GROQ_TIMEOUT=30000
ELEVENLABS_TIMEOUT=30000
WEB_SEARCH_TIMEOUT=10000
```

### Rate Limiting

```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=1000          # requests per window
```

### CORS Settings

```env
CORS_ORIGIN=true           # Allow all origins (dev only)
CORS_CREDENTIALS=true      # Allow credentials
```

### Logging

```env
LOG_LEVEL=info            # info, warn, error, debug
LOG_FORMAT=combined       # combined, common, short, tiny
```

### Feature Flags

```env
ENABLE_FALLBACK=true      # Enable fallback parsing when AI fails
ANALYTICS_ENABLED=false   # Enable usage analytics
DEBUG_MODE=false          # Enable debug logging
```

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
DEBUG_MODE=true
LOG_LEVEL=debug
CORS_ORIGIN=true
```

### Production
```env
NODE_ENV=production
DEBUG_MODE=false
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=500
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different keys** for development and production
3. **Rotate keys regularly** in production
4. **Restrict CORS origins** in production
5. **Use appropriate rate limits** for your use case

## Configuration API

The configuration system provides programmatic access:

```javascript
const { getConfig } = require('./config');

const config = getConfig();

// Check if services are configured
if (config.hasGroqApiKey()) {
  // Groq API is available
}

if (config.hasElevenLabsApiKey()) {
  // ElevenLabs TTS is available
}

// Access configuration sections
console.log(config.server.port);
console.log(config.groq.model);
console.log(config.features.debugMode);
```

## Health Check Endpoint

The `/health` endpoint now shows configuration status:

```bash
curl http://localhost:3000/health
```

```json
{
  "status": "healthy",
  "environment": "development",
  "services": {
    "groq": "configured",
    "elevenlabs": "configured", 
    "webSearch": "not configured"
  },
  "features": {
    "fallbackMode": true,
    "debugMode": false
  }
}
```

## Troubleshooting

### Server won't start
- Check if `GROQ_API_KEY` is set correctly
- Ensure the key starts with `gsk_`
- Verify the key is valid by testing it manually

### Fallback mode is always active
- Check if `GROQ_API_KEY` is correct
- Verify network connectivity to Groq API
- Enable `DEBUG_MODE=true` for more details

### Text-to-speech not working
- Verify `ELEVENLABS_API_KEY` is set
- Check ElevenLabs API quota/limits
- System will use fallback audio if TTS fails

## Migration from Old Configuration

If you're upgrading from a previous version:

1. **Update service imports:**
   ```javascript
   // Old
   const groqApiKey = process.env.GROQ_API_KEY;
   
   // New  
   const { getConfig } = require('../config');
   const config = getConfig();
   const groqApiKey = config.groq.apiKey;
   ```

2. **Update server configuration:**
   ```javascript
   // Old
   const PORT = process.env.PORT || 3000;
   
   // New
   const config = getConfig();
   const PORT = config.server.port;
   ```

3. **Test thoroughly** - The new system is more strict about validation

## Support

If you encounter configuration issues:

1. Check this documentation
2. Verify your `.env` file format
3. Check the console for detailed error messages
4. Enable debug mode for additional logging
