# Voice Web Controller Setup Script
# Run this script to set up the complete system

Write-Host "🚀 Voice Web Controller Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check Node.js
Write-Host "📋 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Setup Backend
Write-Host "`n📦 Setting up backend..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Backend setup failed" -ForegroundColor Red
    exit 1
}

# Setup Frontend
Write-Host "`n📦 Setting up frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend setup failed" -ForegroundColor Red
    exit 1
}

# Build Extension
Write-Host "`n🔨 Building browser extension..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Extension built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Extension build failed" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Check .env file
if (Test-Path ".env") {
    Write-Host "✅ Environment file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating .env from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Please edit .env file with your API keys:" -ForegroundColor Cyan
    Write-Host "   - GROQ_API_KEY=your_groq_api_key" -ForegroundColor White
    Write-Host "   - ELEVENLABS_API_KEY=your_elevenlabs_api_key" -ForegroundColor White
}

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your API keys" -ForegroundColor White
Write-Host "2. Start backend: " -NoNewline -ForegroundColor White
Write-Host "`$env:GROQ_API_KEY='your_key'; `$env:ELEVENLABS_API_KEY='your_key'; npm start" -ForegroundColor Cyan
Write-Host "3. Load extension in Chrome:" -ForegroundColor White
Write-Host "   - Go to chrome://extensions/" -ForegroundColor Gray
Write-Host "   - Enable Developer mode" -ForegroundColor Gray
Write-Host "   - Click 'Load unpacked'" -ForegroundColor Gray
Write-Host "   - Select 'frontend/dist' folder" -ForegroundColor Gray
Write-Host "`n4. Test on any website with Ctrl+Shift+V or the floating button!" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - API Docs: readme.md" -ForegroundColor Gray
Write-Host "   - Complete Guide: PROJECT_README.md" -ForegroundColor Gray
Write-Host "   - Task Breakdown: voice_web_task_breakdown_json.json" -ForegroundColor Gray

Write-Host "`n💡 Quick Test Commands:" -ForegroundColor Yellow
Write-Host '   - "Scroll down"' -ForegroundColor Cyan
Write-Host '   - "Go back"' -ForegroundColor Cyan
Write-Host '   - "Search for [query]"' -ForegroundColor Cyan
Write-Host '   - "Click on [element]"' -ForegroundColor Cyan
