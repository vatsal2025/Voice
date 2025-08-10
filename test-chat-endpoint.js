#!/usr/bin/env node
// test-chat-endpoint.js - Simple test script for the /ai/chat endpoint

const http = require('http');

// Test data
const testMessage = "Hello! Can you tell me what is the capital of France?";

const postData = JSON.stringify({
  message: testMessage,
  context: "This is a test of the general chat endpoint",
  options: {
    provider: "auto",
    temperature: 0.7,
    maxTokens: 100
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing /api/ai/chat endpoint...');
console.log(`📝 Test message: "${testMessage}"`);
console.log('📡 Making request to http://localhost:3000/api/ai/chat');

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log('\n📥 Response Body:');
    try {
      const response = JSON.parse(body);
      console.log(JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('\n✅ Test PASSED! Chat endpoint is working correctly.');
        console.log(`🤖 AI Response: "${response.response}"`);
        console.log(`⚡ Processing time: ${response.metadata.processingTime}ms`);
        console.log(`🔧 Provider used: ${response.metadata.provider}`);
        console.log(`🎯 Model used: ${response.metadata.model}`);
      } else {
        console.log('\n❌ Test FAILED! Expected success: true');
      }
    } catch (error) {
      console.log('\n❌ Test FAILED! Invalid JSON response:');
      console.log(body);
      console.error('Parse error:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('\n🚨 Request Error:', error.message);
  console.log('\n💡 Make sure the server is running: node server.js');
  console.log('💡 Check if GROQ_API_KEY is configured in your .env file');
});

req.on('timeout', () => {
  console.error('\n⏰ Request timed out');
  req.destroy();
});

// Set timeout to 30 seconds
req.setTimeout(30000);

// Write data to request body
req.write(postData);
req.end();

console.log('\n⏳ Waiting for response...');
