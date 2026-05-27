# 🚀 Deployment Guide - Sowing Assessment Frontend

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Production Optimization](#production-optimization)
5. [Troubleshooting](#troubleshooting)

---

## Local Development

### Quick Setup (Linux/macOS)

```bash
# 1. Clone/Navigate to frontend
cd frontend

# 2. Run installation script
chmod +x install.sh
./install.sh

# 3. Start development server
npm run dev
```

### Quick Setup (Windows)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Run installation script
install.cmd

# 3. Start development server
npm run dev
```

### Manual Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Access: **http://localhost:3000**

---

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# From project root
docker-compose -f docker-compose.frontend.yml up -d
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: localhost:5432
- pgAdmin: http://localhost:5050

### Using Docker Run

```bash
# Build image
docker build -t sowing-frontend:latest frontend/

# Run container
docker run -d \
  --name sowing-frontend \
  -p 3000:3000 \
  -e VITE_API_URL=http://backend:8080/api \
  sowing-frontend:latest
```

### Using Shell Script

```bash
cd frontend
chmod +x docker-run.sh
./docker-run.sh
```

### Docker Compose with Nginx

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: sowing-frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:8080/api
    depends_on:
      - backend
    networks:
      - sowing-network

  backend:
    # ... backend service

networks:
  sowing-network:
    driver: bridge
```

---

## Cloud Deployment

### Netlify Deployment (Recommended for SPA)

#### Prerequisites
- Netlify account: https://app.netlify.com
- GitHub repository connected
- `netlify-cli` installed: `npm install -g netlify-cli`

#### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Netlify deployment configuration"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select GitHub and your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy"

3. **Set Environment Variables** (if needed)
   - In Netlify settings → Environment
   - Add `VITE_API_URL=https://your-backend.com/api`

4. **Deploy automatically on push**
   - Netlify will automatically deploy whenever you push to main branch

#### Method 2: Netlify CLI (Local Deployment)

1. **Authenticate**
   ```bash
   netlify login
   ```

2. **Deploy**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod
   ```

#### Method 3: Manual Build & Deploy

1. **Build locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### ✅ Fixing "Page not found" Error

If you encounter "Looks like you've followed a broken link..." errors:

**The issue:** Netlify isn't serving `index.html` for client-side routes.

**The solution is already configured:**
- `netlify.toml` has SPA redirect rules (all requests → `/index.html`)
- `public/_redirects` provides a fallback configuration
- Cache headers are optimized for SPA delivery

**Troubleshooting steps:**

1. **Clear cache and redeploy**
   ```bash
   # Go to Netlify site settings
   # Under "Deploys" → Click "Trigger deploy" → "Deploy site"
   # Or use CLI:
   netlify deploy --prod --clear-cache
   ```

2. **Verify build output**
   ```bash
   npm run build
   ls -la dist/  # Should contain index.html and asset files
   ```

3. **Check Netlify configuration**
   ```bash
   # Review netlify.toml redirects
   cat netlify.toml
   ```

4. **Environment variables**
   - Ensure `VITE_API_URL` is correctly set for your deployment
   - Frontend should be running at `https://your-site.netlify.app`

5. **Full redeploy**
   ```bash
   # Complete rebuild
   cd frontend
   rm -rf node_modules dist package-lock.json
   npm install
   npm run build
   netlify deploy --prod
   ```

#### Production Settings

In **Netlify Settings** → **Build & Deploy**:

```
Build command:          npm run build
Publish directory:      dist
Node version:          18 (or higher)
```

#### Environment Variables for Production

In **Netlify Settings** → **Environment**:

```
VITE_API_URL          https://api.yourdomain.com/api
VITE_ENV              production
```

---

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment**
   - Set `VITE_API_URL` in Vercel project settings
   - Domain will be assigned automatically

### AWS S3 + CloudFront

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Create S3 bucket**
   ```bash
   aws s3 mb s3://sowing-assessment-frontend
   ```

3. **Upload build artifacts**
   ```bash
   aws s3 sync dist/ s3://sowing-assessment-frontend/
   ```

4. **Create CloudFront distribution**
   ```bash
   aws cloudfront create-distribution \
     --origin-domain-name sowing-assessment-frontend.s3.amazonaws.com \
     --default-root-object index.html
   ```

5. **Invalidate cache**
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id <DISTRIBUTION_ID> \
     --paths "/*"
   ```

### Netlify Deployment

1. **Connect GitHub repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set environment variables**
   - `VITE_API_URL`: Your API endpoint

4. **Deploy**
   - Netlify will auto-deploy on git push

### Google Cloud Platform (Cloud Run)

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and push to Container Registry**
   ```bash
   gcloud builds submit --tag gcr.io/<PROJECT_ID>/sowing-frontend
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy sowing-frontend \
     --image gcr.io/<PROJECT_ID>/sowing-frontend \
     --platform managed \
     --region us-central1 \
     --set-env-vars VITE_API_URL=https://api.example.com
   ```

### Azure App Service

1. **Create resource group**
   ```bash
   az group create --name sowing-rg --location eastus
   ```

2. **Create App Service plan**
   ```bash
   az appservice plan create \
     --name sowing-plan \
     --resource-group sowing-rg \
     --sku F1 --is-linux
   ```

3. **Create web app**
   ```bash
   az webapp create \
     --resource-group sowing-rg \
     --plan sowing-plan \
     --name sowing-frontend \
     --runtime "NODE:18-lts"
   ```

4. **Deploy from GitHub**
   ```bash
   az webapp deployment github-actions add \
     --repo <GITHUB_REPO> \
     --resource-group sowing-rg \
     --name sowing-frontend
   ```

---

## Production Optimization

### Build Optimization

```bash
# Production build with analysis
npm run build

# Check bundle size
npm install -g @vite/inspector
vite-inspector dist
```

### Environment Configuration

Create `.env.production`:

```
VITE_API_URL=https://api.yourdomain.com/api
VITE_MAP_CENTER=16.5062,80.6437
VITE_MAP_ZOOM=7
VITE_ENABLE_ANALYTICS=true
```

### Nginx Configuration

`nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Performance Checklist

- ✓ Enable gzip compression
- ✓ Use CDN for static assets
- ✓ Enable HTTP/2
- ✓ Set appropriate cache headers
- ✓ Minify JavaScript/CSS
- ✓ Optimize images
- ✓ Use production API endpoint
- ✓ Enable monitoring

### HTTPS Configuration

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --webroot -w /var/www/sowing -d your-domain.com

# Update Nginx config
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

### API Connection Issues

1. **Check backend is running**
   ```bash
   curl http://localhost:8080/api/parcels
   ```

2. **Verify CORS configuration** on backend
3. **Check .env.local** API URL
4. **Check network tab** in browser DevTools

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Docker Issues

```bash
# Check logs
docker logs sowing-frontend

# Rebuild image
docker build --no-cache -t sowing-frontend:latest .

# Prune unused images
docker image prune -a
```

### Performance Issues

```bash
# Analyze bundle
npm run build
npx source-map-explorer dist/assets/*.js
```

---

## Monitoring & Logging

### Application Monitoring

- Use Sentry for error tracking
- Set up Google Analytics
- Monitor API response times
- Track user sessions

### Log Management

- Centralize logs using ELK Stack
- Use AWS CloudWatch
- Set up Datadog monitoring

### Health Checks

```bash
# Add to deployment script
curl -f http://localhost:3000 || exit 1
```

---

## Rollback Procedure

### Git-based

```bash
git revert <commit-hash>
git push origin main
# Redeploy automatically
```

### Docker

```bash
# Tag previous working image
docker tag sowing-frontend:v1.0.0 sowing-frontend:latest

# Restart with previous image
docker-compose restart frontend
```

---

## Support & Documentation

- **README.md**: Project overview
- **SETUP.md**: Development setup
- **Frontend issues**: Check browser console
- **API issues**: Check backend logs
- **Deployment help**: Refer to cloud provider docs

---

**Happy Deploying! 🚀**
