# 🚀 Complete Deployment Guide - Frontend + Backend

## Current Issues
✅ Frontend SPA routing fixed  
❌ Backend not deployed (running locally only)  
❌ API endpoint misconfigured  

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend

1. **Add render.yaml** (for automated deployment):
```yaml
# render.yaml
services:
  - type: web
    name: crop-sowing-backend
    env: java
    buildCommand: "./mvnw clean package -DskipTests"
    startCommand: "java -jar target/crop-sowing-intelligence-1.0.0.jar"
    region: singapore
    plan: free
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: SPRING_DATASOURCE_URL
        fromDatabase:
          name: crop-sowing-db
          property: connectionString
      - key: SPRING_DATASOURCE_USERNAME
        fromDatabase:
          name: crop-sowing-db
          property: user
      - key: SPRING_DATASOURCE_PASSWORD
        fromDatabase:
          name: crop-sowing-db
          property: password

  - type: postgres
    name: crop-sowing-db
    region: singapore
    plan: free
```

2. **Update Spring Boot CORS configuration**:

Create/update `src/main/java/com/ap/agri/cropmonitoring/config/CorsConfig.java`:

```java
package com.ap.agri.cropmonitoring.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://*.netlify.app",
                "https://yourdomain.com"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

3. **Create production properties file**:

`src/main/resources/application-prod.properties`:
```properties
# Server
server.servlet.context-path=/api

# Database (Render provides via env vars)
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate

# JWT
app.jwt.secret=${JWT_SECRET:your-super-secret-key-change-in-render}
app.jwt.expiration=${JWT_EXPIRATION:86400000}

# Logging
logging.level.root=INFO
logging.level.com.ap.agri=DEBUG
```

### Step 2: Deploy to Render

1. **Push to GitHub**:
```bash
cd f:\Automated\ Crop\ Sowing\ Assessment
git add .
git commit -m "Add backend deployment configuration and CORS setup"
git push origin main
```

2. **Connect to Render**:
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Select your repository
   - Choose `crop-sowing-backend` (or leave blank)
   - Build command: `./mvnw clean package -DskipTests`
   - Start command: `java -jar target/crop-sowing-intelligence-1.0.0.jar`
   - Click "Create Web Service"

3. **Render will create**:
   - PostgreSQL database with PostGIS
   - Java web service
   - Automatic deployment from GitHub

4. **Note your backend URL**: `https://crop-sowing-backend.onrender.com` (example)

---

## Part 2: Configure & Deploy Frontend

### Step 1: Update Frontend Environment

1. **Create .env.production**:
```bash
cd frontend
cat > .env.production << EOF
VITE_API_URL=https://crop-sowing-backend.onrender.com/api
EOF
```

2. **Update netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[context.production]
  command = "npm run build"
  publish = "dist"

[context.deploy-preview]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true

[[headers]]
  for = "/dist/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### Step 2: Deploy Frontend

1. **Commit and push**:
```bash
git add frontend/
git commit -m "Update frontend API endpoint for production deployment"
git push origin main
```

2. **Netlify automatically deploys** when you push

3. **Verify in Netlify**:
   - Go to https://app.netlify.com
   - Check deployment status
   - Frontend URL: `https://yourdomain.netlify.app`

---

## Part 3: Verify Everything Works

### Test Connection:

```bash
# From frontend directory
cd frontend

# 1. Local test (with backend running locally)
VITE_API_URL=http://localhost:8080/api npm run dev
# Visit http://localhost:5173

# 2. Production test (after deployment)
# Check browser console for errors
# Network tab should show API calls to: https://crop-sowing-backend.onrender.com/api
```

### Check Backend Health:

```bash
# Should return 200
curl https://crop-sowing-backend.onrender.com/api/health

# Should return parcels data
curl https://crop-sowing-backend.onrender.com/api/parcels \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Part 4: Database Setup on Render

1. **Render creates PostgreSQL automatically**
2. **Enable PostGIS**:
   ```sql
   -- Connect to Render database
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS postgis_topology;
   ```

3. **Run migrations**:
   - Backend auto-runs `src/main/resources/db/migration/V1__init_schema.sql`
   - Or manually run Flyway migrations

---

## 🔧 Troubleshooting

### "Page not found" on Frontend
- ✅ Already fixed with redirects
- Clear Netlify cache: Dashboard → Deploys → "Trigger deploy" → "Clear cache & redeploy"

### "API call fails / 404"
- [ ] Verify backend deployed: `curl https://your-backend.onrender.com/api/health`
- [ ] Check CORS enabled in backend
- [ ] Verify `VITE_API_URL` is correct in Netlify env vars
- [ ] Clear browser cache & reload

### "Database connection failed"
- [ ] Check Render PostgreSQL credentials
- [ ] Verify `SPRING_DATASOURCE_URL` format: `postgresql://user:password@host:5432/dbname`
- [ ] PostGIS extension created

### "JWT token errors"
- [ ] Set `JWT_SECRET` in Render environment variables
- [ ] Use same secret in frontend & backend

---

## 📊 Final Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (React)                       │
│  https://yourdomain.netlify.app         │
│  - SPA routing ✅                       │
│  - API calls to backend ✅              │
└────────────────┬────────────────────────┘
                 │ CORS enabled
                 │ VITE_API_URL
                 ↓
┌─────────────────────────────────────────┐
│  Backend (Spring Boot)                  │
│  https://crop-sowing-backend.onrender.  │
│  - REST API ✅                          │
│  - Authentication ✅                    │
│  - Business logic ✅                    │
└────────────────┬────────────────────────┘
                 │ JDBC
                 ↓
┌─────────────────────────────────────────┐
│  Database (PostgreSQL + PostGIS)        │
│  Render managed                         │
│  - Parcels, NDVI, e-Panta data ✅      │
│  - Spatial queries ✅                   │
└─────────────────────────────────────────┘
```

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] PostgreSQL database created with PostGIS
- [ ] CORS configuration in place
- [ ] Environment variables set in Render
- [ ] Frontend `.env.production` has correct API URL
- [ ] Frontend deployed to Netlify
- [ ] Test API calls from browser console
- [ ] Verify spatial queries work
- [ ] Check performance and latency

---

**Status**: After completing these steps, both frontend and backend will be fully deployed and connected! 🎉
