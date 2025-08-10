// healthcheck.js - Docker Health Check Script
const http = require('http');

// Import config to get correct port (with fallback for Docker scenarios)
let port = 3000;
try {
  const { getConfig } = require('./config');
  const config = getConfig();
  port = config.server.port;
} catch (error) {
  // Fallback to environment variable if config fails to load
  port = process.env.PORT || 3000;
  console.warn('Using fallback port configuration for health check');
}

const options = {
  hostname: 'localhost',
  port: port,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const request = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const health = JSON.parse(data);
      
      if (res.statusCode === 200 && health.status === 'healthy') {
        console.log('✅ Health check passed');
        process.exit(0);
      } else {
        console.error('❌ Health check failed:', health);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Health check failed - Invalid response:', error.message);
      process.exit(1);
    }
  });
});

request.on('timeout', () => {
  console.error('❌ Health check failed - Request timeout');
  request.destroy();
  process.exit(1);
});

request.on('error', (error) => {
  console.error('❌ Health check failed - Request error:', error.message);
  process.exit(1);
});

request.end();