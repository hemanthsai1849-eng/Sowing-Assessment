# Sowing Assessment & Fallow Land Intelligence - Frontend

Professional GIS Dashboard for Agricultural Monitoring

## 🎯 Overview

React-based GIS frontend for Sowing Assessment and Fallow Land Intelligence System. Features interactive mapping of Krishna and Godavari river basins with agricultural parcel monitoring, NDVI analysis, and e-Panta verification.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Build

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── MapContainer.tsx          # Main Leaflet map
│   │   ├── Sidebar.tsx                # Filter sidebar
│   │   ├── AnalyticsPanel.tsx        # Analytics charts
│   │   ├── layers/
│   │   │   ├── DistrictLayer.tsx    # Administrative boundaries
│   │   │   ├── RiverLayer.tsx       # Krishna & Godavari basins
│   │   │   ├── ParcelLayer.tsx      # Agricultural parcels
│   │   │   ├── NDVILayer.tsx        # NDVI heatmap
│   │   │   └── FallowLayer.tsx      # Fallow land alerts
│   │   └── controls/
│   │       ├── LayerControl.tsx     # Layer toggle
│   │       └── LegendControl.tsx    # Map legend
│   ├── pages/
│   │   ├── Dashboard.tsx            # Main GIS dashboard
│   │   ├── FallowAnalysis.tsx       # Fallow land analysis
│   │   ├── EPantaComparison.tsx     # e-Panta verification
│   │   └── RiverBasinIntelligence.tsx # Basin analysis
│   ├── services/
│   │   └── api.ts                   # Backend API client
│   ├── store/
│   │   ├── mapSlice.ts              # Map state management
│   │   ├── dataSlice.ts             # Data state management
│   │   └── index.ts                 # Redux store config
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── data/
│   │   ├── boundaries.ts            # District GeoJSON
│   │   ├── rivers.ts                # River basin GeoJSON
│   │   └── parcels.ts               # Sample parcel data
│   ├── hooks/
│   │   ├── useAppRedux.ts           # Redux hooks
│   │   └── useGeolocation.ts        # Geolocation hook
│   ├── styles/
│   │   └── globals.css              # Global styles
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # Entry point
├── index.html                       # HTML template
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
└── package.json                     # Dependencies
```

## 🗺️ GIS Layers

### Base Layers
- **OpenStreetMap**: Base mapping layer

### Administrative Boundaries
- District boundaries
- Mandal boundaries
- Village boundaries

### Agricultural Data
- **Parcels**: Colored by crop status (Green: Cropped, Yellow: Likely Cropped, Red: Fallow)
- **NDVI Heatmap**: Vegetation index visualization
- **Fallow Land**: Special highlighting of uncultivated parcels

### River Infrastructure
- **Krishna Basin**: River network and irrigation command areas
- **Godavari Basin**: River network and irrigation command areas

## 🎨 Features

### Dashboard
- Interactive GIS map with multiple layers
- Real-time layer toggling
- Dynamic legend
- Parcel information popups
- District and basin filtering
- Quick statistics sidebar

### Analytics
- Crop distribution by area
- NDVI trend analysis
- Crop status distribution
- Basin-wise irrigation coverage
- Time-series monitoring

### Fallow Land Analysis
- Fallow area tracking
- District-wise comparison
- Severity classification
- Trend analysis
- Critical alerts

### e-Panta Verification
- Satellite vs. registration comparison
- Mismatch detection
- Anomaly analysis
- Verification rates

### River Basin Intelligence
- Krishna basin statistics
- Godavari basin statistics
- Irrigation command coverage
- Basin comparison analysis

## 🔗 API Integration

### Endpoints

```
GET /api/parcels                    # All parcels
GET /api/parcels/fallow            # Fallow parcels
GET /api/analytics/district/:id    # District analytics
GET /api/analytics/mandal/:id      # Mandal analytics
GET /api/ndvi/current              # Current NDVI data
GET /api/basins/krishna            # Krishna basin data
GET /api/basins/godavari           # Godavari basin data
GET /api/epanta/compare/:id/:id    # e-Panta comparison
GET /api/alerts                    # All alerts
```

## 🛠️ Tech Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **Leaflet**: GIS mapping
- **React Leaflet**: React components for Leaflet
- **Redux Toolkit**: State management
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **Turf.js**: Spatial analysis

## 🎯 Color Schema

### Crop Status
- 🟢 **Green (#10b981)**: Cropped
- 🟡 **Yellow (#eab308)**: Likely Cropped
- 🔴 **Red (#ef4444)**: Fallow

### NDVI Values
- 🟢 **Dark Green (#1e3a1f)**: 0.7+ (Healthy vegetation)
- 🟢 **Green (#10b981)**: 0.5-0.7
- 🟡 **Yellow (#eab308)**: 0.3-0.5
- 🔴 **Red (#ef4444)**: <0.3 (No vegetation)

### River Basins
- 🔵 **Sky Blue**: Krishna Basin
- 🔷 **Cyan**: Godavari Basin

## 📊 Data Format

### GeoJSON Features
All spatial data uses standard GeoJSON format:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [...] },
      "properties": { "id": 1, "name": "..." }
    }
  ]
}
```

## 🔐 Configuration

Create `.env.local`:

```
VITE_API_URL=http://localhost:8080/api
VITE_MAP_CENTER=16.5062,80.6437
VITE_MAP_ZOOM=7
```

## 📱 Responsive Design

- Mobile-first approach
- Responsive sidebar toggle
- Mobile-optimized map controls
- Tablet and desktop layouts

## 🚀 Deployment

### Production Build

```bash
npm run build
```

Output directory: `dist/`

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔄 Redux State

### Map State
- `center`: Map center coordinates
- `zoom`: Zoom level
- `activeLayers`: Visible layers
- `selectedParcel`: Currently selected parcel
- `selectedDistrict`: Currently selected district

### Data State
- `parcels`: Parcel data
- `ndviRecords`: NDVI values
- `epantaRecords`: e-Panta registrations
- `alerts`: System alerts
- `loading`: Loading state
- `error`: Error messages

## 🌐 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

Government of Andhra Pradesh - Agriculture Department

## 📧 Support

For issues or feature requests, please contact the development team.
