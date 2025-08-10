// config/index.js - Centralized Configuration with Validation
require('dotenv').config();

class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

class Config {
  constructor() {
    this.validateEnvironment();
    this.loadConfiguration();
  }

  validateEnvironment() {
    const requiredEnvVars = {
      GROQ_API_KEY: {
        required: true,
        description: 'Groq API key for AI intent processing'
      },
      OPENAI_API_KEY: {
        required: false,
        description: 'OpenAI API key for AI intent processing fallback (optional)'
      },
      ELEVENLABS_API_KEY: {
        required: false,
        description: 'ElevenLabs API key for text-to-speech (optional, fallback available)'
      },
      WEB_SEARCH_API_KEY: {
        required: false,
        description: 'Web Search API key for enhanced search functionality (optional)'
      },
      PORT: {
        required: false,
        description: 'Server port (defaults to 3000)',
        default: '3000'
      },
      NODE_ENV: {
        required: false,
        description: 'Environment mode (development, production, test)',
        default: 'development'
      }
    };

    const missingRequired = [];
    const warnings = [];

    // Check each environment variable
    Object.entries(requiredEnvVars).forEach(([key, config]) => {
      const value = process.env[key];
      
      if (!value || value.trim() === '') {
        if (config.required) {
          missingRequired.push({
            key,
            description: config.description
          });
        } else if (!config.default) {
          warnings.push({
            key,
            description: config.description
          });
        }
      } else {
        // Validate the format of existing values
        this.validateEnvVarFormat(key, value, config);
      }
    });

    // Handle missing required variables
    if (missingRequired.length > 0) {
      const errorMessage = this.createMissingEnvErrorMessage(missingRequired);
      throw new ConfigurationError(errorMessage);
    }

    // Log warnings for optional missing variables
    if (warnings.length > 0) {
      console.warn('⚠️  Configuration Warnings:');
      warnings.forEach(({ key, description }) => {
        console.warn(`   • ${key}: ${description}`);
      });
      console.warn('   Some features may be limited without these configurations.\n');
    }
  }

  validateEnvVarFormat(key, value, config) {
    switch (key) {
      case 'GROQ_API_KEY':
        if (!value.startsWith('gsk_')) {
          console.warn(`⚠️  GROQ_API_KEY should typically start with 'gsk_' - please verify your key is correct`);
        }
        if (value.length < 20) {
          throw new ConfigurationError(`GROQ_API_KEY appears to be too short. Please verify your API key.`);
        }
        break;

      case 'PORT':
        const port = parseInt(value);
        if (isNaN(port) || port < 1 || port > 65535) {
          throw new ConfigurationError(`PORT must be a valid port number between 1 and 65535, got: ${value}`);
        }
        break;

      case 'NODE_ENV':
        const validEnvs = ['development', 'production', 'test', 'staging'];
        if (!validEnvs.includes(value.toLowerCase())) {
          console.warn(`⚠️  NODE_ENV '${value}' is not a standard environment. Consider using: ${validEnvs.join(', ')}`);
        }
        break;

      case 'ELEVENLABS_API_KEY':
        if (value.length < 20) {
          console.warn(`⚠️  ELEVENLABS_API_KEY appears to be too short - please verify your key is correct`);
        }
        break;
    }
  }

  createMissingEnvErrorMessage(missingVars) {
    let message = '\n🚨 CONFIGURATION ERROR: Missing required environment variables\n\n';
    
    missingVars.forEach(({ key, description }) => {
      message += `❌ ${key}\n   ${description}\n\n`;
    });

    message += 'To fix this issue:\n';
    message += '1. Create a .env file in your project root directory\n';
    message += '2. Add the missing variables:\n\n';
    
    missingVars.forEach(({ key }) => {
      switch (key) {
        case 'GROQ_API_KEY':
          message += `   ${key}=gsk_your_groq_api_key_here\n`;
          message += '   # Get your key from: https://console.groq.com/keys\n\n';
          break;
        default:
          message += `   ${key}=your_${key.toLowerCase()}_here\n\n`;
      }
    });

    message += '3. Restart the server\n';
    message += '\nExample .env file:\n';
    message += '   GROQ_API_KEY=gsk_your_actual_key_here\n';
    message += '   PORT=3000\n';
    message += '   NODE_ENV=development\n';

    return message;
  }

  loadConfiguration() {
    this.config = {
      // API Keys
      groq: {
        apiKey: process.env.GROQ_API_KEY,
        baseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
        model: process.env.GROQ_MODEL || 'llama3-8b-8192',
        timeout: parseInt(process.env.GROQ_TIMEOUT) || 30000
      },

      openai: {
        apiKey: process.env.OPENAI_API_KEY || null,
        baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        timeout: parseInt(process.env.OPENAI_TIMEOUT) || 30000
      },

      elevenlabs: {
        apiKey: process.env.ELEVENLABS_API_KEY || null,
        baseUrl: process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io/v1',
        defaultVoice: process.env.ELEVENLABS_DEFAULT_VOICE || 'rachel',
        timeout: parseInt(process.env.ELEVENLABS_TIMEOUT) || 30000
      },

      webSearch: {
        apiKey: process.env.WEB_SEARCH_API_KEY || null,
        provider: process.env.WEB_SEARCH_PROVIDER || 'google',
        timeout: parseInt(process.env.WEB_SEARCH_TIMEOUT) || 10000
      },

      // Server Configuration
      server: {
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || 'localhost',
        environment: process.env.NODE_ENV || 'development',
        cors: {
          origin: process.env.CORS_ORIGIN || true,
          credentials: process.env.CORS_CREDENTIALS === 'true'
        },
        rateLimit: {
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
          max: parseInt(process.env.RATE_LIMIT_MAX) || 1000, // requests per window
        }
      },

      // Logging
      logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined'
      },

      // Features
      features: {
        fallbackMode: process.env.ENABLE_FALLBACK !== 'false', // Default true
        analyticsEnabled: process.env.ANALYTICS_ENABLED === 'true',
        debugMode: process.env.DEBUG_MODE === 'true'
      }
    };

    // Log successful configuration load
    console.log('✅ Configuration loaded successfully');
    this.logConfigurationStatus();
  }

  logConfigurationStatus() {
    console.log('\n📋 Configuration Status:');
    
    // API Services
    console.log('   🤖 Groq AI Service:', this.config.groq.apiKey ? '✅ Configured' : '❌ Missing API Key');
    console.log('   🧠 OpenAI Fallback:', this.config.openai.apiKey ? '✅ Configured' : '⚠️  Not configured (fallback unavailable)');
    console.log('   🎤 ElevenLabs TTS:', this.config.elevenlabs.apiKey ? '✅ Configured' : '⚠️  Not configured (fallback available)');
    console.log('   🔍 Web Search:', this.config.webSearch.apiKey ? '✅ Configured' : '⚠️  Not configured (limited functionality)');
    
    // Server
    console.log(`   🌐 Server: Port ${this.config.server.port} (${this.config.server.environment} mode)`);
    console.log(`   🛡️  Security: Rate limiting (${this.config.server.rateLimit.max} requests/${this.config.server.rateLimit.windowMs/1000/60}min)`);
    
    // Features
    console.log(`   🔧 Features: Fallback=${this.config.features.fallbackMode}, Debug=${this.config.features.debugMode}`);
    console.log('');
  }

  // Getters for easy access
  get groq() {
    return this.config.groq;
  }

  get openai() {
    return this.config.openai;
  }

  get elevenlabs() {
    return this.config.elevenlabs;
  }

  get webSearch() {
    return this.config.webSearch;
  }

  get server() {
    return this.config.server;
  }

  get logging() {
    return this.config.logging;
  }

  get features() {
    return this.config.features;
  }

  // Utility methods
  isProduction() {
    return this.config.server.environment === 'production';
  }

  isDevelopment() {
    return this.config.server.environment === 'development';
  }

  isTest() {
    return this.config.server.environment === 'test';
  }

  hasGroqApiKey() {
    return !!(this.config.groq.apiKey);
  }

  hasOpenAiApiKey() {
    return !!(this.config.openai.apiKey);
  }

  hasElevenLabsApiKey() {
    return !!(this.config.elevenlabs.apiKey);
  }

  hasWebSearchApiKey() {
    return !!(this.config.webSearch.apiKey);
  }

  // Method to get sanitized config for debugging (without API keys)
  getSanitizedConfig() {
    const sanitized = JSON.parse(JSON.stringify(this.config));
    
    // Remove or mask sensitive data
    if (sanitized.groq.apiKey) {
      sanitized.groq.apiKey = '***REDACTED***';
    }
    if (sanitized.openai.apiKey) {
      sanitized.openai.apiKey = '***REDACTED***';
    }
    if (sanitized.elevenlabs.apiKey) {
      sanitized.elevenlabs.apiKey = '***REDACTED***';
    }
    if (sanitized.webSearch.apiKey) {
      sanitized.webSearch.apiKey = '***REDACTED***';
    }
    
    return sanitized;
  }
}

// Export singleton instance
let configInstance = null;

function getConfig() {
  if (!configInstance) {
    configInstance = new Config();
  }
  return configInstance;
}

// Export both the class and instance getter
module.exports = {
  Config,
  getConfig,
  ConfigurationError
};
