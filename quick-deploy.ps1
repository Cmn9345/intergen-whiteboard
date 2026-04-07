# Quick Deploy Script
Write-Host "Intergen Whiteboard - Quick Deploy" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Please install Node.js first" -ForegroundColor Red
    exit 1
}

# Check npm
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Please install npm first" -ForegroundColor Red
    exit 1
}

Write-Host "1. Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "2. Building project..." -ForegroundColor Yellow
$env:DATABASE_URL="file:./dev.db"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Deployment options:" -ForegroundColor Cyan
    Write-Host "1. Deploy with Vercel CLI" -ForegroundColor White
    Write-Host "2. Manual upload to Vercel website" -ForegroundColor White
    Write-Host "3. Deploy with Netlify" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Please choose deployment method (1-3)"
    
    switch ($choice) {
        "1" {
            Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
            Write-Host "Please run: vercel login" -ForegroundColor Cyan
            Write-Host "Then run: vercel --prod" -ForegroundColor Cyan
        }
        "2" {
            Write-Host "Please visit https://vercel.com" -ForegroundColor Cyan
            Write-Host "1. Click 'New Project'" -ForegroundColor White
            Write-Host "2. Upload project folder" -ForegroundColor White
            Write-Host "3. Set environment variable: DATABASE_URL=file:./dev.db" -ForegroundColor White
        }
        "3" {
            Write-Host "Please visit https://netlify.com" -ForegroundColor Cyan
            Write-Host "1. Drag .next folder to deploy area" -ForegroundColor White
            Write-Host "2. Or use Netlify CLI" -ForegroundColor White
        }
        default {
            Write-Host "Invalid choice" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Build failed, please check error messages" -ForegroundColor Red
}

Write-Host ""
Write-Host "After deployment, you will get a public URL" -ForegroundColor Green
Write-Host "Other computers can access your app through this link" -ForegroundColor Green
