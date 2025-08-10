// server.js - Main Express Server
// Load and validate configuration FIRST
const { getConfig } = require('./config');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');

// Initialize configuration (will validate environment variables)
const config = getConfig();

// Import routes (after configuration is validated)
const intentRoutes = require('./routes/intent');
const commandRoutes = require('./routes/commands');
const contextRoutes = require('./routes/context');
const speechRoutes = require('./routes/speech');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = config.server.port;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting (use config values)
const limiter = rateLimit({
  windowMs: config.server.rateLimit.windowMs,
  max: config.server.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration (use config values)
app.use(cors({
  origin: config.server.cors.origin,
  credentials: config.server.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['*'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware (use config format)
app.use(morgan(config.logging.format));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.environment,
    services: {
      groq: config.hasGroqApiKey() ? 'configured' : 'missing',
      elevenlabs: config.hasElevenLabsApiKey() ? 'configured' : 'not configured',
      webSearch: config.hasWebSearchApiKey() ? 'configured' : 'not configured'
    },
    features: {
      fallbackMode: config.features.fallbackMode,
      debugMode: config.features.debugMode
    }
  });
});

// Enhanced health check endpoint that validates API connectivity
app.get('/health/api', async (req, res) => {
  const healthStatus = {
    status: 'unknown',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.environment,
    services: {
      groq: {
        configured: config.hasGroqApiKey(),
        status: 'unknown',
        lastChecked: null,
        error: null
      },
      elevenlabs: {
        configured: config.hasElevenLabsApiKey(),
        status: config.hasElevenLabsApiKey() ? 'configured' : 'not configured'
      },
      webSearch: {
        configured: config.hasWebSearchApiKey(),
        status: config.hasWebSearchApiKey() ? 'configured' : 'not configured'
      }
    },
    overall: {
      healthy: false,
      critical_services_ok: false
    }
  };

  // Test Groq API connectivity if configured
  if (config.hasGroqApiKey()) {
    try {
      const Groq = require('groq-sdk');
      const groq = new Groq({
        apiKey: config.groq.apiKey,
        baseURL: config.groq.baseUrl,
        timeout: 10000 // 10 second timeout for health check
      });

      // Make a minimal test request to validate API key
      const testResponse = await groq.chat.completions.create({
        messages: [{
          role: 'user',
          content: 'test'
        }],
        model: config.groq.model,
        max_tokens: 1,
        temperature: 0
      });

      healthStatus.services.groq.status = 'healthy';
      healthStatus.services.groq.lastChecked = new Date().toISOString();
      healthStatus.services.groq.model = config.groq.model;
      healthStatus.overall.critical_services_ok = true;
      
    } catch (error) {
      healthStatus.services.groq.status = 'error';
      healthStatus.services.groq.lastChecked = new Date().toISOString();
      healthStatus.services.groq.error = {
        message: error.message,
        code: error.code,
        type: error.type || 'unknown'
      };
      
      // Provide helpful error messages
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        healthStatus.services.groq.error.suggestion = 'Check if your GROQ_API_KEY is valid and properly formatted';
      } else if (error.message.includes('timeout')) {
        healthStatus.services.groq.error.suggestion = 'Groq API is slow to respond, may be experiencing issues';
      } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        healthStatus.services.groq.error.suggestion = 'Check your internet connection and Groq API URL';
      }
    }
  } else {
    healthStatus.services.groq.status = 'missing_api_key';
    healthStatus.services.groq.error = {
      message: 'GROQ_API_KEY is not configured',
      suggestion: 'Set GROQ_API_KEY environment variable with your Groq API key'
    };
  }

  // Determine overall health
  healthStatus.overall.healthy = healthStatus.services.groq.status === 'healthy';
  healthStatus.status = healthStatus.overall.healthy ? 'healthy' : 'unhealthy';

  // Set appropriate HTTP status code
  const statusCode = healthStatus.overall.healthy ? 200 : 503;
  
  res.status(statusCode).json(healthStatus);
});

// API routes
app.use('/api/intent', intentRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/ai', aiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Voice Web Interaction API',
    version: '1.0.0',
    endpoints: [
      '/api/intent - Intent processing',
      '/api/commands - Command execution',
      '/api/context - Context management',
      '/api/speech - Speech services',
      '/api/ai - AI-powered page analysis and chat',
      '/health - Health check'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid JSON format',
      message: 'Please check your request body format'
    });
  }
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'Request body exceeds size limit'
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.path} does not exist`,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Voice Web API Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://${config.server.host}:${PORT}/health`);
});

module.exports = app;