# Frontend Setup & Installation Guide

## ✅ System Requirements

- Node.js 16+ (18+ recommended)
- npm 8+ or yarn 3+
- Modern browser (Chrome, Firefox, Safari, Edge)
- 2GB RAM minimum
- 500MB disk space

## 📦 Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- React 18 + React DOM
- Vite (build tool)
- TypeScript
- Leaflet & React Leaflet
- TailwindCSS
- Redux Toolkit
- Material UI
- Recharts
- Axios
- And all other dependencies

### 2. Environment Configuration

Create `.env.local` in the frontend directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```
VITE_API_URL=http://localhost:8080/api
VITE_MAP_CENTER=16.5062,80.6437
VITE_MAP_ZOOM=7
VITE_ENABLE_ANALYTICS=true
```

### 3. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

Server features:
- Hot module replacement (HMR)
- API proxy to backend (localhost:8080)
- Fast refresh on code changes

## 🚀 Building for Production

### Build Optimization

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory:
- Minified JavaScript
- CSS optimization
- Tree-shaking
- Code splitting

### Preview Production Build

```bash
npm run preview
```

## 🗺️ GIS Map Initialization

The map will initialize at:
- **Center**: Andhra Pradesh (16.5062°N, 80.6437°E)
- **Initial Zoom**: 7
- **Base Layer**: OpenStreetMap

### Layer Load Order
1. Base tiles (OpenStreetMap)
2. District boundaries (if enabled)
3. River basins - Krishna and Godavari
4. Agricultural parcels
5. NDVI heatmap
6. Fallow land alerts

## 📊 Data Loading

The frontend loads data from backend APIs:

```
GET /api/parcels                    # ~500ms
GET /api/ndvi/current              # ~300ms
GET /api/basins/krishna            # ~200ms
GET /api/basins/godavari           # ~200ms
```

All requests include:
- Automatic retry (3 attempts)
- Request timeout (30s)
- Error handling
- Loading state management

## 🎨 Customization

### Theme Colors

Edit `src/styles/globals.css`:

```css
.crop-green { /* #10b981 */ }
.likely-yellow { /* #eab308 */ }
.fallow-red { /* #ef4444 */ }
```

### Map Center & Zoom

Edit `.env.local`:

```
VITE_MAP_CENTER=16.5062,80.6437
VITE_MAP_ZOOM=7
```

### API Endpoint

Edit `.env.local`:

```
VITE_API_URL=http://your-api-server/api
```

## 🧪 Testing

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 📁 Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/components` | Reusable React components |
| `src/pages` | Page/view components |
| `src/store` | Redux slices and store |
| `src/services` | API client functions |
| `src/types` | TypeScript interfaces |
| `src/data` | Sample GeoJSON data |
| `src/hooks` | Custom React hooks |
| `src/styles` | CSS and Tailwind config |

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
npm run dev -- --port 3001
```

### API Connection Error

Check that backend is running:
```bash
# Should return 200 OK
curl http://localhost:8080/api/parcels
```

### Map Not Loading

1. Check browser console for errors
2. Verify Leaflet CSS is loaded
3. Check `.env.local` configuration
4. Clear browser cache and refresh

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🚢 Deployment

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t sowing-frontend .
docker run -p 80:80 sowing-frontend
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

## 📚 Project Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview prod build |
| `npm run type-check` | TypeScript check |
| `npm run lint` | ESLint check |

## 🔍 Performance Optimization

### Current Optimizations
- Code splitting via Vite
- Lazy component loading
- GeoJSON feature clustering (Leaflet)
- Redux state batching
- CSS minification
- JavaScript minification

### Recommended for High Traffic
- Add CDN for static assets
- Enable gzip compression
- Implement service worker
- Add image optimization
- Enable HTTP/2 push

## 📖 Additional Resources

### Documentation
- [React Docs](https://react.dev)
- [Leaflet Docs](https://leafletjs.com)
- [Leaflet React](https://react-leaflet.js.org)
- [Redux Docs](https://redux.js.org)
- [TailwindCSS](https://tailwindcss.com)

### GIS Resources
- [GeoJSON Spec](https://geojson.org/)
- [Turf.js](https://turfjs.org/)
- [Leaflet Plugins](https://leafletjs.com/plugins.html)

## ⚙️ Advanced Configuration

### Proxy Configuration

Edit `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  },
}
```

### TypeScript Path Aliases

Already configured in `tsconfig.json`:

```
@/* → src/*
@components/* → src/components/*
@pages/* → src/pages/*
```

## 🎓 Next Steps

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open in Browser**
   Navigate to http://localhost:3000

3. **Explore Features**
   - Toggle layers
   - Click parcels for details
   - View analytics dashboard
   - Check fallow analysis

4. **Connect Backend**
   - Ensure backend is running on localhost:8080
   - APIs will auto-connect
   - Check Redux store for data

5. **Customize**
   - Update colors and theme
   - Modify map center/zoom
   - Add new components
   - Extend Redux slices

## 📞 Support

For issues or questions, refer to:
- Backend API documentation
- Component docstrings
- Redux state structure
- Console error messages

Good luck! 🚀
