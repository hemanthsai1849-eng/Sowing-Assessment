# 🚀 Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (2 min)

**Windows:**
```cmd
cd frontend
install.cmd
```

**Linux/macOS:**
```bash
cd frontend
chmod +x install.sh
./install.sh
```

**Manual:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment (1 min)

```bash
cp .env.example .env.local
```

Edit `.env.local` if needed:
```
VITE_API_URL=http://localhost:8080/api
```

### Step 3: Start Development Server (1 min)

```bash
npm run dev
```

### Step 4: Open Browser (1 min)

Navigate to: **http://localhost:3000**

**Demo Credentials:**
- Username: `ap_admin`
- Password: `admin123`

---

## 🗺️ First Steps in the Dashboard

### 1. Explore the Map
- Toggle layers on/off (top-left)
- Click parcels to view details
- Zoom and pan around

### 2. View Data
- Check sidebar for quick stats
- Toggle analytics panel (top-right)
- View different pages via sidebar menu

### 3. Test Features
- Search for parcels (by survey, village, district)
- View time-series NDVI data
- Analyze fallow lands
- Compare e-Panta records

---

## 📦 Docker Quick Start

```bash
# Navigate to project root
cd ..

# Run with Docker Compose
docker-compose -f docker-compose.frontend.yml up -d

# Access frontend
open http://localhost:3000

# Stop services
docker-compose -f docker-compose.frontend.yml down
```

---

## 🔧 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Check TypeScript types |
| `npm run lint` | Run ESLint |

---

## 🐛 Common Issues & Fixes

### Port 3000 Already in Use
```bash
npm run dev -- --port 3001
```

### API Connection Error
1. Ensure backend is running: `http://localhost:8080`
2. Check `.env.local` API URL
3. Check browser network tab

### Dependencies Installation Failed
```bash
rm -rf node_modules package-lock.json
npm install
```

### Page Not Loading
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for errors

---

## 📊 GIS Map Layers

**Currently Active Layers:**
- ✓ OpenStreetMap basemap
- ✓ District boundaries
- ✓ Krishna River Basin
- ✓ Godavari River Basin
- ✓ Agricultural parcels
- ✓ NDVI heatmap
- ✓ Fallow land alerts

**Toggle layers** using the layer control (top-left corner).

---

## 🎨 Color Reference

### Crop Status
- 🟢 **Green**: Cropped
- 🟡 **Yellow**: Likely Cropped
- 🔴 **Red**: Fallow

### NDVI Values
- 🟩 **Dark Green**: 0.7+ (Healthy)
- 🟢 **Green**: 0.5-0.7
- 🟡 **Yellow**: 0.3-0.5
- 🔴 **Red**: <0.3 (Poor)

### Rivers
- 🔵 **Sky Blue**: Krishna Basin
- 🔷 **Cyan**: Godavari Basin

---

## 📱 Mobile Access

The dashboard is mobile-responsive:
- Mobile sidebar toggle (top-left)
- Touch-friendly controls
- Optimized for tablets
- Responsive analytics

---

## 🌐 Pages Available

1. **Dashboard** (`/`)
   - Main GIS map with all layers
   - Real-time analytics

2. **Fallow Analysis** (`/fallow-analysis`)
   - Fallow land statistics
   - District comparisons
   - Severity analysis

3. **e-Panta Comparison** (`/epanta-comparison`)
   - Verification metrics
   - Mismatch detection
   - Alert recommendations

4. **River Basin Intelligence** (`/river-basins`)
   - Basin statistics
   - Irrigation coverage
   - Water resource analysis

5. **Settings** (`/settings`)
   - Map configuration
   - UI preferences
   - Data settings

---

## 🔌 Connected to Backend?

The frontend expects these backend APIs:

```
✓ GET /api/parcels
✓ GET /api/ndvi/current
✓ GET /api/basins/krishna
✓ GET /api/basins/godavari
✓ GET /api/analytics/overall
✓ GET /api/epanta
✓ GET /api/alerts
```

**If backend is not running**, the app uses **sample demo data**.

---

## 📚 Next Steps

### For Development
1. Review [SETUP.md](./SETUP.md) for detailed setup
2. Check [README.md](./README.md) for full documentation
3. Explore component code in `src/components/`
4. Study Redux store in `src/store/`

### For Deployment
1. Read [DEPLOY.md](./DEPLOY.md) for deployment guides
2. Build production: `npm run build`
3. Deploy to your platform (Vercel, AWS, Docker, etc.)

### For Customization
1. Update colors in `tailwind.config.js`
2. Modify map settings in `.env.local`
3. Add new components to `src/components/`
4. Extend Redux slices in `src/store/`

---

## 💡 Pro Tips

1. **Use Redux DevTools** in Chrome to inspect state
2. **Check browser console** for API errors
3. **Use layer control** to manage map complexity
4. **Enable auto-refresh** in settings for live updates
5. **Bookmark frequently visited locations** on the map

---

## 🆘 Need Help?

- Check **browser console** (F12) for errors
- Review `.env.local` configuration
- Ensure backend is running
- Check [README.md](./README.md) documentation
- Check [SETUP.md](./SETUP.md) for detailed setup

---

## 🎉 You're All Set!

The GIS dashboard is ready to use. Start exploring agricultural data, monitor parcels, and analyze fallow lands.

**Happy Monitoring! 🌾🗺️**
