# 🌾 Automated Crop Sowing Assessment - Complete Repository Exploration

> **Production-Grade GIS Agricultural Intelligence System**  
> Built with Java Spring Boot (Backend) + React TypeScript (Frontend)  
> GitHub: https://github.com/hemanthsai1849-eng/Sowing-Assessment.git

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Complete File Structure](#complete-file-structure)
3. [Backend Architecture (Java/Spring Boot)](#backend-architecture)
4. [Frontend Architecture (React/TypeScript)](#frontend-architecture)
5. [Database Schema](#database-schema)
6. [Configuration Files](#configuration-files)
7. [Key Backend Files](#key-backend-files)
8. [Key Frontend Files](#key-frontend-files)
9. [Docker Configuration](#docker-configuration)
10. [Documentation](#documentation)

---

## Project Overview

### System Purpose
An automated GIS-based agricultural intelligence system for the Government of Andhra Pradesh that:
- 🗺️ Monitors agricultural parcels with interactive GIS mapping
- 🌾 Detects sowing patterns and crop status using satellite NDVI analysis
- 🔍 Identifies fallow (uncultivated) land for government intervention
- 🔄 Validates crop data against e-Panta government registrations
- 📊 Provides analytics and alerting for anomalies
- 🎯 Integrates Krishna & Godavari river basin data

### Tech Stack
- **Backend**: Java 17, Spring Boot 3.3.0, Spring Security, Spring Data JPA
- **Frontend**: React 18, TypeScript, Vite, Redux Toolkit, React Leaflet, Tailwind CSS
- **Spatial Data**: PostGIS (PostgreSQL), GeoTools, Hibernate Spatial
- **Mapping**: Leaflet.js
- **Build**: Maven (Backend), npm (Frontend)
- **Deployment**: Docker, Docker Compose

### Target Audience
- Government Agriculture Department Officials
- GIS Analysts
- Agricultural Researchers
- Field Officers

---

## Complete File Structure

```
Automated Crop Sowing Assessment/
│
├── Backend (Java/Spring Boot)
│   ├── src/main/java/com/ap/agri/cropmonitoring/
│   │   ├── CropMonitoringApplication.java          [Main Spring Boot entry point]
│   │   ├── config/                                  [Configuration classes]
│   │   │   ├── OpenApiConfig.java                  [OpenAPI/Swagger config]
│   │   │   └── security/                            [Security configuration]
│   │   │       ├── SecurityConfig.java              [Spring Security config]
│   │   │       ├── JwtTokenProvider.java            [JWT token generation]
│   │   │       └── JwtAuthenticationFilter.java     [JWT filter]
│   │   └── modules/                                 [Business logic modules]
│   │       ├── auth/                                [Authentication module]
│   │       │   ├── controllers/AuthController.java
│   │       │   ├── services/AuthService.java
│   │       │   ├── dtos/AuthRequest.java, AuthResponse.java
│   │       │   ├── entities/User.java, Role.java
│   │       │   └── repositories/UserRepository.java, RoleRepository.java
│   │       │
│   │       ├── parcel/                              [Parcel management module]
│   │       │   ├── controllers/ParcelController.java
│   │       │   ├── services/ParcelService.java
│   │       │   ├── dtos/ParcelDto.java
│   │       │   ├── entities/
│   │       │   │   ├── Parcel.java                  [Land parcel entity]
│   │       │   │   ├── District.java                [District entity]
│   │       │   │   ├── Mandal.java                  [Sub-district entity]
│   │       │   │   └── Village.java                 [Village entity]
│   │       │   ├── mappers/ParcelMapper.java
│   │       │   └── repositories/
│   │       │       ├── ParcelRepository.java
│   │       │       ├── DistrictRepository.java
│   │       │       ├── MandalRepository.java
│   │       │       └── VillageRepository.java
│   │       │
│   │       ├── monitoring/                          [Satellite & NDVI monitoring]
│   │       │   ├── entities/
│   │       │   │   ├── SatelliteObservation.java    [Satellite tile data]
│   │       │   │   ├── NDVIRecord.java              [Vegetation index records]
│   │       │   │   └── CropSeason.java              [Crop season definitions]
│   │       │   ├── dtos/
│   │       │   ├── mappers/
│   │       │   └── repositories/
│   │       │       ├── SatelliteObservationRepository.java
│   │       │       ├── NDVIRecordRepository.java
│   │       │       └── CropSeasonRepository.java
│   │       │
│   │       ├── classification/                      [AI/Heuristic classification]
│   │       │   ├── controllers/CropClassificationController.java
│   │       │   └── services/CropClassificationService.java
│   │       │
│   │       ├── analytics/                           [Analytics & reporting]
│   │       │   ├── controllers/AnalyticsController.java
│   │       │   └── services/AnalyticsService.java
│   │       │
│   │       ├── epanta/                              [Government registration validation]
│   │       │   ├── controllers/EPantaValidationController.java
│   │       │   ├── services/EPantaValidationService.java
│   │       │   ├── entities/EPantaRecord.java
│   │       │   └── repositories/EPantaRecordRepository.java
│   │       │
│   │       ├── alerts/                              [Alert generation system]
│   │       │   ├── entities/Alert.java
│   │       │   └── repositories/AlertRepository.java
│   │       │
│   │       ├── soil/                                [Soil data management]
│   │       │   ├── entities/SoilData.java
│   │       │   └── repositories/SoilDataRepository.java
│   │       │
│   │       ├── weather/                             [Weather data tracking]
│   │       │   ├── entities/WeatherData.java
│   │       │   └── repositories/WeatherDataRepository.java
│   │       │
│   │       └── classification/                      [Crop classification]
│   │           ├── controllers/CropClassificationController.java
│   │           └── services/CropClassificationService.java
│   │
│   │   └── shared/                                  [Shared utilities]
│   │       ├── dto/ApiResponse.java                 [Standard API response wrapper]
│   │       ├── exception/                           [Custom exceptions]
│   │       └── utils/                               [Utility functions]
│   │
│   ├── src/main/resources/
│   │   ├── application.properties                   [Main config (port, DB, JWT)]
│   │   ├── application-dev.properties               [Dev environment config]
│   │   └── db/migration/
│   │       └── V1__init_schema.sql                  [Database initialization script]
│   │
│   ├── pom.xml                                      [Maven configuration]
│   ├── Dockerfile                                   [Backend container image]
│   └── mvnw.cmd                                     [Maven wrapper script]
│
├── Frontend (React/TypeScript)
│   ├── src/
│   │   ├── components/                              [Reusable React components]
│   │   │   ├── MapContainer.tsx                     [Main Leaflet GIS map wrapper]
│   │   │   ├── Sidebar.tsx                          [Left navigation panel]
│   │   │   ├── AnalyticsPanel.tsx                   [Dashboard charts & metrics]
│   │   │   ├── ParcelSearch.tsx                     [Advanced search component]
│   │   │   ├── NDVITimeSeries.tsx                   [Time-series NDVI viewer]
│   │   │   ├── DraggableLegend.tsx                  [Interactive legend]
│   │   │   │
│   │   │   ├── layers/                              [Map layer components]
│   │   │   │   ├── ParcelLayer.tsx                  [Parcel polygon visualization]
│   │   │   │   ├── RiverLayer.tsx                   [Krishna & Godavari basin]
│   │   │   │   ├── NDVILayer.tsx                    [NDVI heatmap layer]
│   │   │   │   ├── FallowLayer.tsx                  [Fallow land highlighting]
│   │   │   │   └── DistrictLayer.tsx                [District boundaries]
│   │   │   │
│   │   │   └── controls/                            [Map control components]
│   │   │       ├── LayerControl.tsx                 [Layer toggle control]
│   │   │       └── LegendControl.tsx                [Map legend control]
│   │   │
│   │   ├── pages/                                   [Full-page views]
│   │   │   ├── Dashboard.tsx                        [Main GIS dashboard]
│   │   │   ├── FallowAnalysis.tsx                   [Fallow land detection analysis]
│   │   │   ├── EPantaComparison.tsx                 [Verify against govt records]
│   │   │   ├── RiverBasinIntelligence.tsx           [Basin-level analytics]
│   │   │   ├── SpatialAnalysis.tsx                  [Advanced spatial analysis]
│   │   │   ├── Settings.tsx                         [Configuration panel]
│   │   │   └── Login.tsx                            [Authentication page]
│   │   │
│   │   ├── store/                                   [Redux state management]
│   │   │   ├── index.ts                             [Redux store configuration]
│   │   │   ├── mapSlice.ts                          [Map state slice]
│   │   │   └── dataSlice.ts                         [Data state slice]
│   │   │
│   │   ├── services/                                [API integration]
│   │   │   └── api.ts                               [Axios instance & API endpoints]
│   │   │
│   │   ├── hooks/                                   [Custom React hooks]
│   │   │   ├── useAppRedux.ts                       [Redux hooks wrapper]
│   │   │   └── useGeolocation.ts                    [Browser geolocation hook]
│   │   │
│   │   ├── types/                                   [TypeScript interfaces]
│   │   │   └── index.ts                             [Shared type definitions]
│   │   │
│   │   ├── data/                                    [Static GeoJSON data]
│   │   │   ├── boundaries.ts                        [District/mandal boundaries]
│   │   │   ├── parcels.ts                           [Sample parcel data]
│   │   │   └── rivers.ts                            [River basin GeoJSON]
│   │   │
│   │   ├── styles/                                  [Global stylesheets]
│   │   │   └── globals.css                          [Tailwind & custom CSS]
│   │   │
│   │   ├── App.tsx                                  [Root component & routing]
│   │   └── main.tsx                                 [React entry point]
│   │
│   ├── index.html                                   [HTML template]
│   ├── package.json                                 [npm dependencies & scripts]
│   ├── tsconfig.json                                [TypeScript configuration]
│   ├── vite.config.ts                               [Vite build configuration]
│   ├── tailwind.config.cjs                          [Tailwind CSS config]
│   ├── postcss.config.cjs                           [PostCSS plugin config]
│   ├── Dockerfile                                   [Frontend container image]
│   ├── docker-run.sh                                [Docker run script]
│   ├── install.sh & install.cmd                     [Dependency install scripts]
│   ├── README.md                                    [Frontend documentation]
│   ├── QUICK_START.md                               [5-minute setup guide]
│   ├── SETUP.md                                     [Detailed setup instructions]
│   └── DEPLOY.md                                    [Deployment guides]
│
├── Root Configuration Files
│   ├── pom.xml                                      [Maven POM configuration]
│   ├── docker-compose.yml                           [Full stack orchestration]
│   ├── docker-compose.frontend.yml                  [Frontend-only compose]
│   ├── Dockerfile                                   [Backend multi-stage build]
│   │
│   ├── mvnw.cmd                                     [Maven wrapper (Windows)]
│   ├── README.md                                    [Main project README]
│   ├── PROJECT_README.md                            [Detailed project info]
│   ├── FEATURE_MATRIX.md                            [Feature completeness matrix]
│   ├── FRONTEND_SUMMARY.md                          [Frontend implementation summary]
│   └── IMPLEMENTATION_COMPLETE.md                   [Implementation completion report]
│
├── Utilities & Logs
│   ├── scratch/                                     [Development utilities]
│   │   ├── setup_project_db.sql                     [Database setup script]
│   │   ├── enable_postgis.sql                       [PostGIS extension script]
│   │   ├── test_api.ps1                             [API testing script]
│   │   ├── TestBCrypt.java                          [BCrypt testing utility]
│   │   └── payloads/                                [API test payloads]
│   │       ├── auth_payload.json
│   │       ├── epanta_payload.json
│   │       ├── parcel_payload.json
│   │       └── satellite_payload.json
│   │
│   ├── logs/                                        [Application logs]
│   │
│   └── target/                                      [Maven build output]
│       ├── classes/
│       ├── generated-sources/
│       └── test-classes/
│
└── Version Control
    └── .git/                                        [Git repository]
```

---

## Backend Architecture

### Java Module Structure

#### 1. **Authentication Module** (`src/main/java/.../modules/auth/`)
**Purpose**: User authentication, authorization, and JWT token management

**Key Files**:
- [AuthController.java](src/main/java/com/ap/agri/cropmonitoring/modules/auth/controllers/AuthController.java)
  - `POST /api/v1/auth/login` - User login with credentials
  - Returns JWT token for authenticated requests

- [User.java](src/main/java/com/ap/agri/cropmonitoring/modules/auth/entities/User.java)
  - Fields: id, username, password (BCrypt), email, fullName, role, active, createdAt
  - Relations: ManyToOne with Role

- [Role.java](src/main/java/com/ap/agri/cropmonitoring/modules/auth/entities/Role.java)
  - Roles: ADMIN, OFFICER, ANALYST
  - Controls API access via @PreAuthorize annotations

- [JwtTokenProvider.java](src/main/java/com/ap/agri/cropmonitoring/config/security/JwtTokenProvider.java)
  - Token generation with 24-hour expiration
  - Token validation and claim extraction

- [SecurityConfig.java](src/main/java/com/ap/agri/cropmonitoring/config/security/SecurityConfig.java)
  - Spring Security filter chain configuration
  - CORS settings

#### 2. **Parcel Management Module** (`src/main/java/.../modules/parcel/`)
**Purpose**: Land parcel (cadastral) management and spatial operations

**Key Files**:
- [ParcelController.java](src/main/java/com/ap/agri/cropmonitoring/modules/parcel/controllers/ParcelController.java)
  - `POST /api/v1/parcels` - Register new parcel with GeoJSON boundary
  - `GET /api/v1/parcels/{id}` - Retrieve parcel details
  - `GET /api/v1/parcels/village/{villageId}` - List parcels by village
  - Supports spatial queries and boundary validation

- [Parcel.java](src/main/java/com/ap/agri/cropmonitoring/modules/parcel/entities/Parcel.java)
  - Spatial entity using Hibernate Spatial (JTS Polygon)
  - Fields: id, village, surveyNumber, farmerName, areaHa, boundary (Polygon), currentStatus, lastUpdated
  - Status values: CROPPED, LIKELY_CROPPED, FALLOW
  - Unique constraint: village_id + survey_number

- [District.java](src/main/java/com/ap/agri/cropmonitoring/modules/parcel/entities/District.java)
  - Fields: id, name, code, boundary (MultiPolygon)
  - Admin-level geographic boundary

- [Mandal.java](src/main/java/com/ap/agri/cropmonitoring/modules/parcel/entities/Mandal.java)
  - Fields: id, district, name, code, boundary (MultiPolygon)
  - Sub-district administrative unit

- [Village.java](src/main/java/com/ap/agri/cropmonitoring/modules/parcel/entities/Village.java)
  - Fields: id, mandal, name, code, boundary (MultiPolygon)
  - Village-level spatial boundary

#### 3. **Monitoring Module** (`src/main/java/.../modules/monitoring/`)
**Purpose**: Satellite observation and NDVI (vegetation index) tracking

**Key Files**:
- [SatelliteObservation.java](src/main/java/com/ap/agri/cropmonitoring/modules/monitoring/entities/SatelliteObservation.java)
  - Fields: id, sensorName (SENTINEL-2, LANDSAT-8), cloudCover, acquisitionDate, tileBoundary (Polygon), filePath
  - Represents one satellite pass over the region

- [NDVIRecord.java](src/main/java/com/ap/agri/cropmonitoring/modules/monitoring/entities/NDVIRecord.java)
  - Fields: id, parcel, observation, meanNdvi, maxNdvi, classificationStatus, processedAt
  - Normalized Difference Vegetation Index values per parcel
  - Status: CROPPED, LIKELY_CROPPED, FALLOW (based on NDVI thresholds)

- [CropSeason.java](src/main/java/com/ap/agri/cropmonitoring/modules/monitoring/entities/CropSeason.java)
  - Fields: id, name (KHARIF, RABI, ZAID), year, startDate, endDate, active
  - Defines cropping seasons for the region

#### 4. **Classification Module** (`src/main/java/.../modules/classification/`)
**Purpose**: AI/heuristic NDVI classification engine

**Key Files**:
- [CropClassificationController.java](src/main/java/com/ap/agri/cropmonitoring/modules/classification/controllers/CropClassificationController.java)
  - `POST /api/v1/classification/trigger` - Single parcel classification
  - `POST /api/v1/classification/batch/satellite/{observationId}` - Batch spatial processing
  - Takes NDVI values and applies classification rules

- [CropClassificationService.java](src/main/java/com/ap/agri/cropmonitoring/modules/classification/services/CropClassificationService.java)
  - NDVI thresholds: CROPPED (>0.5), LIKELY_CROPPED (0.3-0.5), FALLOW (<0.3)
  - Batch processing using spatial intersection queries
  - Updates parcel currentStatus based on classification

#### 5. **Analytics Module** (`src/main/java/.../modules/analytics/`)
**Purpose**: Aggregated reporting and dashboard metrics

**Key Files**:
- [AnalyticsController.java](src/main/java/com/ap/agri/cropmonitoring/modules/analytics/controllers/AnalyticsController.java)
  - `GET /api/v1/analytics/district/{districtId}` - District-level report
  - `GET /api/v1/analytics/mandal/{mandalId}` - Mandal-level report
  - Aggregates: total hectares, parcel counts, sowing percentages by status

- [AnalyticsService.java](src/main/java/com/ap/agri/cropmonitoring/modules/analytics/services/AnalyticsService.java)
  - Generates district/mandal intelligence dashboards
  - Calculates sowing ratios and coverage statistics

#### 6. **e-Panta Module** (`src/main/java/.../modules/epanta/`)
**Purpose**: Government registration validation and cross-checking

**Key Files**:
- [EPantaValidationController.java](src/main/java/com/ap/agri/cropmonitoring/modules/epanta/controllers/EPantaValidationController.java)
  - Validates parcel data against government e-Panta registrations

- [EPantaRecord.java](src/main/java/com/ap/agri/cropmonitoring/modules/epanta/entities/EPantaRecord.java)
  - Fields: id, parcel, season, farmerName, cropName, sownAreaHa, registrationDate, verificationStatus
  - Status: VERIFIED, PENDING, REJECTED
  - Unique constraint: parcel_id + season_id

#### 7. **Alerts Module** (`src/main/java/.../modules/alerts/`)
**Purpose**: Anomaly detection and alerting

**Key Files**:
- [Alert.java](src/main/java/com/ap/agri/cropmonitoring/modules/alerts/entities/Alert.java)
  - Fields: id, parcel, season, alertType, message, createdAt, resolved, resolvedAt
  - Alert types: MISMATCH_FOUND, CRITICAL_FALLOW, WEATHER_ANOMALY

#### 8. **Soil & Weather Modules** (`src/main/java/.../modules/soil/`, `weather/`)
**Purpose**: Supporting environmental data tracking

**Key Files**:
- [SoilData.java](src/main/java/com/ap/agri/cropmonitoring/modules/soil/entities/SoilData.java)
  - Fields: pH, nitrogen, phosphorus, potassium, organicCarbon, soilType, testedAt

- [WeatherData.java](src/main/java/com/ap/agri/cropmonitoring/modules/weather/entities/WeatherData.java)
  - Fields: village, recordDate, tempMin, tempMax, precipitation, soilMoisture

### Spring Boot Configuration

#### OpenAPI/Swagger Documentation
- [OpenApiConfig.java](src/main/java/com/ap/agri/cropmonitoring/config/OpenApiConfig.java)
  - Swagger UI: `http://localhost:8080/swagger-ui.html`
  - OpenAPI spec: `http://localhost:8080/v3/api-docs`

#### Security Configuration
- JWT Token-based authentication (stateless)
- BCrypt password hashing
- Role-based access control (@PreAuthorize)
- CORS enabled for frontend

---

## Frontend Architecture

### React Component Hierarchy

```
App.tsx (Root)
├── Router (React Router v6)
│   ├── /login → Login Page
│   └── Protected Routes:
│       ├── / → Dashboard
│       ├── /fallow-analysis → FallowAnalysis
│       ├── /epanta-comparison → EPantaComparison
│       ├── /river-basins → RiverBasinIntelligence
│       ├── /spatial-analysis → SpatialAnalysis
│       └── /settings → Settings
│
└── Redux Provider (ReduxJS Toolkit)
    ├── store/mapSlice.ts
    └── store/dataSlice.ts
```

### Key Components

#### Map Components
- **MapContainer.tsx**
  - Main Leaflet map wrapper
  - Manages all map layers
  - Handles zoom, pan, and layer toggles
  - Proxy target: `http://localhost:8080/api`

- **ParcelLayer.tsx**
  - Renders agricultural parcels as GeoJSON polygons
  - Color-coded by status: Green (CROPPED), Yellow (LIKELY_CROPPED), Red (FALLOW)
  - Interactive popups with parcel details
  - Supports click events and feature highlighting

- **NDVILayer.tsx**
  - Heatmap visualization of NDVI values
  - Color scale: Red (low vegetation) → Yellow → Green (high vegetation)
  - Real-time data updates from API

- **RiverLayer.tsx**
  - Krishna River Basin (multi-polygon)
  - Godavari River Basin (multi-polygon)
  - Static GeoJSON from `src/data/rivers.ts`

- **FallowLayer.tsx**
  - Highlights parcels with FALLOW status
  - Visual alerts for critical fallow conditions
  - Overlay on other layers

- **DistrictLayer.tsx**
  - Administrative boundaries visualization
  - Static data from `src/data/boundaries.ts`
  - Provides geographic context

#### Control Components
- **LayerControl.tsx**
  - Toggle visibility of each layer
  - Layer list: Parcels, NDVI, Rivers, Fallow, Districts
  - Persistent state (localStorage)

- **LegendControl.tsx**
  - Interactive legend display
  - Color meanings for all visualizations
  - Responsive position (top-right, bottom-right)
  - Draggable/collapsible

#### Page Components
- **Dashboard.tsx**
  - Main entry point
  - MapContainer + Sidebar + AnalyticsPanel
  - Real-time map updates
  - Layer management

- **FallowAnalysis.tsx**
  - District-level fallow statistics
  - Charts: Fallow % by district, trend lines
  - Parcel list with fallow status
  - Time-series analysis

- **EPantaComparison.tsx**
  - Verification status dashboard
  - Mismatches between satellite data and e-Panta records
  - Tables: Verified, Pending, Rejected
  - Detailed comparison view

- **RiverBasinIntelligence.tsx**
  - Krishna basin analytics
  - Godavari basin analytics
  - Irrigation coverage statistics
  - Crop distribution by basin

- **SpatialAnalysis.tsx**
  - Advanced geographic queries
  - Buffer analysis
  - Spatial intersections
  - Custom polygon drawing

- **Login.tsx**
  - Username/password authentication
  - Calls `/api/v1/auth/login`
  - JWT token storage in localStorage
  - Redirect to Dashboard on success

- **Settings.tsx**
  - Map preferences (zoom, center)
  - Layer visibility defaults
  - Data refresh intervals
  - User profile information

#### Utility Components
- **Sidebar.tsx**
  - Navigation menu
  - Quick filters
  - Search functionality
  - District/Mandal/Village selectors

- **AnalyticsPanel.tsx**
  - Dashboard charts using Recharts
  - Metrics: Total parcels, Cropped %, Fallow %
  - District comparisons
  - Time-series visualizations

- **ParcelSearch.tsx**
  - Advanced search with autocomplete
  - Filter by: Survey number, Farmer name, Status, Area
  - Results list with map highlighting

- **NDVITimeSeries.tsx**
  - Line chart of NDVI over time
  - Date range selector
  - Parcel-specific history
  - Export to CSV

- **DraggableLegend.tsx**
  - Movable legend widget
  - Minimize/expand
  - Custom styling

### Redux Store

#### mapSlice.ts
```typescript
State:
- center: [lat, lng]
- zoom: number
- selectedLayers: string[]
- activeParcel: Parcel | null
- mapBounds: LatLngBounds

Actions:
- setCenter, setZoom
- toggleLayer, setActiveLayers
- setSelectedParcel
- setBounds
```

#### dataSlice.ts
```typescript
State:
- parcels: Parcel[]
- ndviRecords: NDVIRecord[]
- alerts: Alert[]
- analytics: AnalyticsData
- loading: boolean
- error: string | null

Actions:
- setParcels, addParcel
- setNdviRecords
- setAlerts
- setAnalytics
- setLoading, setError
```

### TypeScript Types (src/types/index.ts)

```typescript
// Core Domain Types
interface Parcel {
  id: number;
  villageId: number;
  surveyNumber: string;
  farmerName: string;
  areaHa: number;
  boundary: GeoJSON.Polygon;
  currentStatus: 'CROPPED' | 'LIKELY_CROPPED' | 'FALLOW';
  lastUpdated: string;
}

interface NDVIRecord {
  id: number;
  parcelId: number;
  observationId: number;
  meanNdvi: number;
  maxNdvi: number;
  classificationStatus: string;
  processedAt: string;
}

interface SatelliteObservation {
  id: number;
  sensorName: 'SENTINEL-2' | 'LANDSAT-8';
  cloudCover: number;
  acquisitionDate: string;
  tileBoundary: GeoJSON.Polygon;
  filePath?: string;
}

interface EPantaRecord {
  id: number;
  parcelId: number;
  seasonId: number;
  farmerName: string;
  cropName: string;
  sownAreaHa: number;
  registrationDate: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

interface Alert {
  id: number;
  parcelId: number;
  seasonId: number;
  alertType: 'MISMATCH_FOUND' | 'CRITICAL_FALLOW' | 'WEATHER_ANOMALY';
  message: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
}
```

### API Integration (src/services/api.ts)

```typescript
// Axios instance with JWT interceptor
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Endpoints:
- POST /auth/login
- GET /parcels/{id}
- GET /parcels/village/{villageId}
- POST /classification/trigger
- GET /analytics/district/{districtId}
- GET /analytics/mandal/{mandalId}
```

### Build Configuration

#### Vite Config (vite.config.ts)
```typescript
- Dev server: port 3000
- Proxy: /api → http://localhost:8080
- React plugin enabled
- TypeScript path aliases: @/* → ./src/*
```

#### TailwindCSS (tailwind.config.cjs)
- Dark theme enabled
- Custom color palette
- Extended spacing
- Dark mode plugins

#### PostCSS (postcss.config.cjs)
- TailwindCSS plugin
- Autoprefixer
- CSS minification

---

## Database Schema

### Overview
PostgreSQL 16 with PostGIS 3.4 for spatial queries

### Tables

#### 1. Roles
```sql
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255)
);
-- Values: ADMIN, OFFICER, ANALYST
```

#### 2. Users
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,           -- BCrypt hashed
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role_id BIGINT REFERENCES roles(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Districts
```sql
CREATE TABLE districts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  boundary GEOMETRY(MultiPolygon, 4326) NOT NULL  -- GIS boundary
);
```

#### 4. Mandals
```sql
CREATE TABLE mandals (
  id BIGSERIAL PRIMARY KEY,
  district_id BIGINT REFERENCES districts(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
  UNIQUE(district_id, name)
);
```

#### 5. Villages
```sql
CREATE TABLE villages (
  id BIGSERIAL PRIMARY KEY,
  mandal_id BIGINT REFERENCES mandals(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
  UNIQUE(mandal_id, name)
);
```

#### 6. Crop Seasons
```sql
CREATE TABLE crop_seasons (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,                -- KHARIF, RABI, ZAID
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  UNIQUE(name, year)
);
```

#### 7. Parcels
```sql
CREATE TABLE parcels (
  id BIGSERIAL PRIMARY KEY,
  village_id BIGINT REFERENCES villages(id) ON DELETE CASCADE,
  survey_number VARCHAR(50) NOT NULL,
  farmer_name VARCHAR(100) NOT NULL,
  area_ha NUMERIC(10, 4) NOT NULL,
  boundary GEOMETRY(Polygon, 4326) NOT NULL,    -- Individual parcel polygon
  current_status VARCHAR(50) DEFAULT 'FALLOW',  -- CROPPED, LIKELY_CROPPED, FALLOW
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(village_id, survey_number)
);
-- Index: GIST on boundary for fast spatial queries
```

#### 8. Satellite Observations
```sql
CREATE TABLE satellite_observations (
  id BIGSERIAL PRIMARY KEY,
  sensor_name VARCHAR(50) NOT NULL,           -- SENTINEL-2, LANDSAT-8
  cloud_cover NUMERIC(5, 2) NOT NULL,
  acquisition_date TIMESTAMP NOT NULL,
  tile_boundary GEOMETRY(Polygon, 4326) NOT NULL,  -- Satellite tile coverage
  file_path VARCHAR(255)
);
```

#### 9. NDVI Records
```sql
CREATE TABLE ndvi_records (
  id BIGSERIAL PRIMARY KEY,
  parcel_id BIGINT REFERENCES parcels(id) ON DELETE CASCADE,
  observation_id BIGINT REFERENCES satellite_observations(id),
  mean_ndvi NUMERIC(5, 4) NOT NULL,          -- -1 to +1 range
  max_ndvi NUMERIC(5, 4) NOT NULL,
  classification_status VARCHAR(50) NOT NULL,  -- CROPPED, LIKELY_CROPPED, FALLOW
  processed_at TIMESTAMP DEFAULT NOW()
);
```

#### 10. Soil Data
```sql
CREATE TABLE soil_data (
  id BIGSERIAL PRIMARY KEY,
  parcel_id BIGINT REFERENCES parcels(id),
  ph NUMERIC(4, 2) NOT NULL,
  nitrogen NUMERIC(8, 2) NOT NULL,           -- kg/ha
  phosphorus NUMERIC(8, 2) NOT NULL,
  potassium NUMERIC(8, 2) NOT NULL,
  organic_carbon NUMERIC(5, 2) NOT NULL,     -- %
  soil_type VARCHAR(100) NOT NULL,           -- Red Sandy, Black Cotton, etc.
  tested_at TIMESTAMP DEFAULT NOW()
);
```

#### 11. Weather Data
```sql
CREATE TABLE weather_data (
  id BIGSERIAL PRIMARY KEY,
  village_id BIGINT REFERENCES villages(id),
  record_date DATE NOT NULL,
  temp_min NUMERIC(4, 1) NOT NULL,           -- Celsius
  temp_max NUMERIC(4, 1) NOT NULL,
  precipitation NUMERIC(6, 2) NOT NULL,      -- mm
  soil_moisture NUMERIC(5, 2) NOT NULL,      -- %
  UNIQUE(village_id, record_date)
);
```

#### 12. e-Panta Records
```sql
CREATE TABLE e_panta_records (
  id BIGSERIAL PRIMARY KEY,
  parcel_id BIGINT REFERENCES parcels(id),
  season_id BIGINT REFERENCES crop_seasons(id),
  farmer_name VARCHAR(100) NOT NULL,
  crop_name VARCHAR(100) NOT NULL,
  sown_area_ha NUMERIC(10, 4) NOT NULL,
  registration_date DATE NOT NULL,
  verification_status VARCHAR(50) NOT NULL,  -- VERIFIED, PENDING, REJECTED
  UNIQUE(parcel_id, season_id)
);
```

#### 13. Alerts
```sql
CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  parcel_id BIGINT REFERENCES parcels(id),
  season_id BIGINT REFERENCES crop_seasons(id),
  alert_type VARCHAR(50) NOT NULL,           -- MISMATCH_FOUND, CRITICAL_FALLOW, WEATHER_ANOMALY
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP
);
```

### Spatial Indexes
```sql
CREATE INDEX idx_districts_boundary ON districts USING GIST (boundary);
CREATE INDEX idx_mandals_boundary ON mandals USING GIST (boundary);
CREATE INDEX idx_villages_boundary ON villages USING GIST (boundary);
CREATE INDEX idx_parcels_boundary ON parcels USING GIST (boundary);
CREATE INDEX idx_satellite_obs_boundary ON satellite_observations USING GIST (tile_boundary);
```

### Seed Data

**Default Roles**:
- ADMIN (Full privileges)
- OFFICER (Operational privileges)
- ANALYST (Read & analysis privileges)

**Default Users**:
- `ap_admin` / `admin123` (ADMIN role)
- `ap_officer` / `admin123` (OFFICER role)
- `ap_analyst` / `admin123` (ANALYST role)
- Password: BCrypt hashed

**Default Seasons**:
- KHARIF 2026 (June 1 - October 31)
- RABI 2026 (November 1 - March 31) [Active]

---

## Configuration Files

### Backend Configuration

#### pom.xml (Maven Dependencies)
Key dependencies:
- **Spring Boot 3.3.0**: Web, Data JPA, Security
- **Spatial Libraries**: Hibernate Spatial, JTS Core, GeoTools 31.0
- **Security**: JJWT 0.12.5 (JWT tokens), Spring Security
- **Database**: PostgreSQL driver, Flyway migrations
- **Utilities**: Lombok, MapStruct, Jackson
- **API Documentation**: SpringDoc OpenAPI 2.5.0
- **Testing**: JUnit 5, MockMvc

#### application.properties
```properties
# Server
server.port=8080
spring.application.name=crop-sowing-intelligence

# Database (HikariCP)
spring.datasource.url=jdbc:postgresql://localhost:5432/crop_monitoring_db
spring.datasource.username=postgres
spring.datasource.password=springstudent
spring.datasource.hikari.maximum-pool-size=15

# Spatial (Hibernate Spatial)
spring.jpa.database-platform=org.hibernate.spatial.dialect.postgis.PostgisPG10Dialect
spring.jpa.properties.hibernate.dialect=org.hibernate.spatial.dialect.postgis.PostgisPG10Dialect

# Flyway Migrations
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# JWT
app.security.jwt.secret=9a6Zp0Wv2BxYc4DeFgHiJkLmNoPqRsTuVwXyZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
app.security.jwt.expiration-ms=86400000     # 24 hours
```

#### application-dev.properties
Development overrides for local debugging

### Frontend Configuration

#### package.json
```json
{
  "name": "sowing-assessment-gis-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",                           // Start dev server on port 3000
    "build": "tsc && vite build",            // Production build
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit"
  }
}
```

**Dependencies**:
- React 18, React Router 6
- Redux Toolkit, React Redux
- React Leaflet 4, Leaflet 1.9
- Material-UI 5 (Icons & Components)
- Recharts (Charts)
- Axios (HTTP)
- TailwindCSS 3 (Styling)
- Vite 5 (Build tool)

#### vite.config.ts
```typescript
- Port: 3000
- Proxy: /api → http://localhost:8080
- React plugin
- Path alias: @/ → ./src/
- TypeScript support
```

#### tsconfig.json
```typescript
- Target: ES2020
- Module: ESNext
- Strict mode: true
- JSX: react-jsx
- Path aliases for imports
```

#### tailwind.config.cjs
```javascript
- Dark theme enabled
- Custom colors: primary, secondary, accent
- Extended spacing and border radius
```

#### postcss.config.cjs
```javascript
- TailwindCSS
- Autoprefixer
```

---

## Key Backend Files

### Critical Controllers

| File | Path | Purpose |
|------|------|---------|
| AuthController | `modules/auth/controllers/` | Login endpoint, JWT generation |
| ParcelController | `modules/parcel/controllers/` | Cadastral parcel CRUD, spatial queries |
| CropClassificationController | `modules/classification/controllers/` | NDVI classification, batch processing |
| AnalyticsController | `modules/analytics/controllers/` | District/Mandal dashboards |
| EPantaValidationController | `modules/epanta/controllers/` | Government record validation |

### Critical Services

| File | Path | Purpose |
|------|------|---------|
| AuthService | `modules/auth/services/` | Authentication logic, BCrypt |
| ParcelService | `modules/parcel/services/` | Parcel management, spatial operations |
| CropClassificationService | `modules/classification/services/` | NDVI thresholds, classification rules |
| AnalyticsService | `modules/analytics/services/` | Report generation, aggregations |
| EPantaValidationService | `modules/epanta/services/` | Cross-validation logic |

### Critical Entities

| File | Path | Primary Keys | Spatial Columns |
|------|------|--------------|-----------------|
| Parcel | `modules/parcel/entities/` | id (SERIAL) | boundary (Polygon) |
| District | `modules/parcel/entities/` | id (SERIAL) | boundary (MultiPolygon) |
| NDVIRecord | `modules/monitoring/entities/` | id (SERIAL) | N/A (references parcel) |
| SatelliteObservation | `modules/monitoring/entities/` | id (SERIAL) | tileBoundary (Polygon) |
| User | `modules/auth/entities/` | id (SERIAL) | N/A |

### Critical DTOs

| File | Path | Purpose |
|------|------|---------|
| ParcelDto | `modules/parcel/dtos/` | Parcel transfer object |
| AuthRequest | `modules/auth/dtos/` | Login credentials |
| AuthResponse | `modules/auth/dtos/` | JWT response |
| ApiResponse<T> | `shared/dto/` | Standard API response wrapper |

### Critical Repositories

```java
// All extend JpaRepository<Entity, Long>

// Auth
UserRepository                  // Find by username, email
RoleRepository                  // Role lookups

// Parcel
ParcelRepository                // Spatial queries, by status
DistrictRepository              // Geographic lookups
MandalRepository                // Sub-district queries
VillageRepository               // Village lookups

// Monitoring
NDVIRecordRepository            // By parcel, by observation
SatelliteObservationRepository  // By sensor, date range

// Crop Management
CropSeasonRepository            // Active season lookup
EPantaRecordRepository          // Verification queries

// Systems
AlertRepository                 // Active/resolved alerts
SoilDataRepository              // Parcel soil properties
WeatherDataRepository           // Village weather records
```

---

## Key Frontend Files

### Pages (src/pages/)

| Component | Route | Purpose | Key Features |
|-----------|-------|---------|--------------|
| Dashboard.tsx | / | Main GIS dashboard | MapContainer + Sidebar + Analytics |
| Login.tsx | /login | Authentication | JWT token storage |
| FallowAnalysis.tsx | /fallow-analysis | Fallow detection | Charts, trends, district stats |
| EPantaComparison.tsx | /epanta-comparison | Verification | Comparison tables, mismatches |
| RiverBasinIntelligence.tsx | /river-basins | Basin analysis | Krishna & Godavari stats |
| SpatialAnalysis.tsx | /spatial-analysis | Advanced queries | Buffer, intersection, drawing |
| Settings.tsx | /settings | Configuration | Preferences, defaults |

### Components (src/components/)

#### Map Layers
| Component | Purpose | Data Source | Visualization |
|-----------|---------|-------------|----------------|
| MapContainer.tsx | Map wrapper | Leaflet, GeoJSON | Interactive map |
| ParcelLayer.tsx | Parcel visualization | API `/api/v1/parcels` | GeoJSON polygons, color-coded |
| RiverLayer.tsx | River basins | `src/data/rivers.ts` | Static MultiPolygons |
| NDVILayer.tsx | NDVI heatmap | API `/api/v1/monitoring/ndvi` | Raster heatmap |
| FallowLayer.tsx | Fallow highlighting | API `/api/v1/parcels?status=FALLOW` | Red overlays |
| DistrictLayer.tsx | District boundaries | `src/data/boundaries.ts` | Static admin boundaries |

#### Controls
| Component | Purpose |
|-----------|---------|
| LayerControl.tsx | Toggle layers on/off |
| LegendControl.tsx | Interactive color legend |

#### Utility Components
| Component | Purpose |
|-----------|---------|
| Sidebar.tsx | Navigation & filters |
| AnalyticsPanel.tsx | Dashboard charts |
| ParcelSearch.tsx | Advanced search |
| NDVITimeSeries.tsx | Historical analysis |
| DraggableLegend.tsx | Movable legend |

### Store (src/store/)

#### mapSlice.ts
```typescript
State Properties:
- center: [number, number]        // Map center [lat, lng]
- zoom: number                    // Current zoom level
- selectedLayers: string[]        // Visible layers
- activeParcel: Parcel | null    // Selected parcel
- mapBounds: Bounds              // Current view bounds
```

#### dataSlice.ts
```typescript
State Properties:
- parcels: Parcel[]              // All parcels in view
- ndviRecords: NDVIRecord[]      // NDVI data
- alerts: Alert[]                // Active alerts
- analytics: Analytics           // Dashboard metrics
- loading: boolean               // Loading state
- error: string | null           // Error messages
```

### Services (src/services/api.ts)

```typescript
// Endpoints:

// Authentication
POST   /api/v1/auth/login                         // Login

// Parcels
GET    /api/v1/parcels/{id}                       // Get parcel details
GET    /api/v1/parcels/village/{villageId}       // List by village
POST   /api/v1/parcels                            // Create parcel

// Monitoring
GET    /api/v1/monitoring/ndvi/parcel/{id}       // NDVI history
POST   /api/v1/monitoring/observations            // Upload observation

// Classification
POST   /api/v1/classification/trigger             // Single classification
POST   /api/v1/classification/batch/satellite/{}  // Batch processing

// Analytics
GET    /api/v1/analytics/district/{id}           // District report
GET    /api/v1/analytics/mandal/{id}             // Mandal report

// e-Panta
GET    /api/v1/epanta/verify/{parcelId}          // Verification status
```

### Hooks (src/hooks/)

| Hook | Purpose |
|------|---------|
| useAppRedux | Typed Redux dispatch/selector |
| useGeolocation | Browser geolocation API |

### Types (src/types/index.ts)

Core interfaces:
- `Parcel`, `NDVIRecord`, `SatelliteObservation`
- `EPantaRecord`, `Alert`, `CropSeason`
- `District`, `Mandal`, `Village`
- `User`, `AuthResponse`, `AnalyticsReport`

### Data (src/data/)

| File | Contents |
|------|----------|
| boundaries.ts | GeoJSON: District & Mandal boundaries |
| parcels.ts | Sample parcel FeatureCollection |
| rivers.ts | GeoJSON: Krishna & Godavari basins |

### Styles (src/styles/)

| File | Purpose |
|------|---------|
| globals.css | TailwindCSS imports, custom styles |
| Tailwind theming (dark mode) |
| Leaflet CSS overrides |

---

## Docker Configuration

### Backend Dockerfile (Dockerfile)
**Multi-stage build**:
1. Stage 1: Maven build (maven:3.9.6-eclipse-temurin-21)
   - Copies pom.xml
   - Downloads dependencies (`mvn dependency:go-offline`)
   - Builds JAR (`mvn clean package`)

2. Stage 2: Runtime (eclipse-temurin:21-jre-alpine)
   - Small Alpine Linux base
   - Non-root user (appuser)
   - Exposes port 8080
   - Environment: SPRING_PROFILES_ACTIVE=prod
   - Java opts: -XX:+UseG1GC -XX:MaxRAMPercentage=75.0

### Frontend Dockerfile (frontend/Dockerfile)
- Base: node:18-alpine
- Installs dependencies (`npm install`)
- Builds frontend (`npm run build`)
- Exposes port 3000
- Runs dev server

### Docker Compose (docker-compose.yml)
**Services**:

1. **db** (PostgreSQL + PostGIS)
   - Image: postgis/postgis:16-3.4
   - Container: ap-crop-monitoring-db
   - Port: 5432
   - Database: crop_monitoring_db
   - User: ap_agri_admin
   - Volume: postgres_data (persistent)
   - Healthcheck: pg_isready

2. **app** (Spring Boot)
   - Builds from ./Dockerfile
   - Container: ap-crop-monitoring-app
   - Port: 8080
   - Depends on: db (healthy)
   - Environment: Database credentials, JWT secret
   - Network: ap_network

3. **pgadmin** (Database UI)
   - Image: dpage/pgadmin4:8.4
   - Container: ap-crop-monitoring-pgadmin
   - Port: 5050
   - Email: admin@ap.gov.in
   - Password: PgAdminPassword2026

**Networks**:
- ap_network (bridge network for inter-service communication)

**Volumes**:
- postgres_data (named volume for database persistence)

### Frontend-Only Compose (docker-compose.frontend.yml)
- Single service: Frontend
- Port: 3000
- Development mode

### Build Commands
```bash
# Build backend
docker build -t crop-sowing-intelligence:1.0.0 .

# Build frontend
cd frontend
docker build -t crop-sowing-intelligence-frontend:1.0.0 .

# Run full stack
docker-compose up -d

# Run frontend only
docker-compose -f docker-compose.frontend.yml up -d
```

---

## Documentation Files

### Root Documentation

| File | Purpose | Contents |
|------|---------|----------|
| README.md | Main project README | Overview, quick start, structure |
| PROJECT_README.md | Detailed project info | Vision, features, tech stack |
| FEATURE_MATRIX.md | Feature completeness | Feature list, status matrix |
| FRONTEND_SUMMARY.md | Frontend summary | Components, pages, implementation |
| IMPLEMENTATION_COMPLETE.md | Completion report | Deliverables, status summary |

### Frontend Documentation

| File | Location | Purpose |
|------|----------|---------|
| README.md | frontend/ | Frontend project overview |
| QUICK_START.md | frontend/ | 5-minute setup guide |
| SETUP.md | frontend/ | Detailed setup instructions |
| DEPLOY.md | frontend/ | Deployment guides (Docker, npm) |

### Database Documentation

| File | Location | Purpose |
|------|----------|---------|
| V1__init_schema.sql | src/main/resources/db/migration/ | Schema initialization |
| setup_project_db.sql | scratch/ | Database setup script |
| enable_postgis.sql | scratch/ | PostGIS extension setup |

### Testing & Utilities

| File | Location | Purpose |
|------|----------|---------|
| test_api.ps1 | scratch/ | PowerShell API testing script |
| TestBCrypt.java | scratch/ | Password hashing test utility |
| auth_payload.json | scratch/payloads/ | Sample login request |
| epanta_payload.json | scratch/payloads/ | Sample e-Panta record |
| parcel_payload.json | scratch/payloads/ | Sample parcel creation |
| satellite_payload.json | scratch/payloads/ | Sample satellite observation |

---

## API Documentation

### Swagger UI
**Accessible at**: `http://localhost:8080/swagger-ui.html`
**OpenAPI spec**: `http://localhost:8080/v3/api-docs`

### Authentication Endpoints
```
POST /api/v1/auth/login
  Request: { username, password }
  Response: { token, expiresIn }
  Auth: None (public)
```

### Parcel Endpoints
```
POST /api/v1/parcels
  Create parcel with GeoJSON boundary
  Auth: ADMIN, OFFICER

GET /api/v1/parcels/{id}
  Fetch parcel details
  Auth: ADMIN, OFFICER, ANALYST

GET /api/v1/parcels/village/{villageId}
  List parcels in village
  Auth: ADMIN, OFFICER, ANALYST
```

### Classification Endpoints
```
POST /api/v1/classification/trigger
  Classify single parcel by NDVI
  Auth: ADMIN, ANALYST

POST /api/v1/classification/batch/satellite/{observationId}
  Batch classify parcels under satellite tile
  Auth: ADMIN, ANALYST
```

### Analytics Endpoints
```
GET /api/v1/analytics/district/{districtId}
  District intelligence dashboard
  Auth: ADMIN, OFFICER, ANALYST

GET /api/v1/analytics/mandal/{mandalId}
  Mandal intelligence dashboard
  Auth: ADMIN, OFFICER, ANALYST
```

### e-Panta Validation Endpoints
```
GET /api/v1/epanta/verify/{parcelId}
  Check government registration match
  Auth: ADMIN, OFFICER, ANALYST
```

---

## Summary Statistics

### Backend
- **Java Files**: 40+
- **Controllers**: 7
- **Services**: 8+
- **Entities**: 13
- **Repositories**: 13
- **DTOs/Models**: 15+
- **Lines of Code**: 5,000+

### Frontend
- **React Components**: 20+
- **Pages**: 7
- **TypeScript Files**: 25+
- **Lines of Code**: 4,000+

### Database
- **Tables**: 13
- **Spatial Indexes**: 5
- **Relationships**: 12+ foreign keys
- **Constraints**: 10+ unique constraints

### Docker
- **Services**: 3 (Database, Backend, PgAdmin)
- **Networks**: 1 (ap_network)
- **Volumes**: 1 (postgres_data)

### Documentation
- **Markdown Files**: 9
- **SQL Scripts**: 3
- **Configuration Files**: 8+
- **API Endpoints**: 15+

---

## Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.9+
- PostgreSQL 16+ with PostGIS 3.4
- Docker & Docker Compose (optional)

### Quick Start

**Backend**:
```bash
mvn clean install
mvn spring-boot:run
# API runs on http://localhost:8080
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

**Database**:
```bash
# Using Docker
docker-compose up -d

# Manual setup
createdb crop_monitoring_db
psql crop_monitoring_db < src/main/resources/db/migration/V1__init_schema.sql
```

### Default Credentials
- **Admin**: ap_admin / admin123
- **Officer**: ap_officer / admin123
- **Analyst**: ap_analyst / admin123
- **PgAdmin**: admin@ap.gov.in / PgAdminPassword2026

---

## Performance Optimizations

### Database
- **Spatial GIST indexes** on polygon boundaries (sub-millisecond queries)
- **HikariCP connection pooling** (15 max, 5 min idle)
- **Batch fetch size** 30 for Hibernate

### Backend
- **JWT stateless authentication** (no session storage)
- **Caching** (@EnableCaching)
- **Scheduling** (@EnableScheduling for batch jobs)
- **G1GC** Java garbage collector

### Frontend
- **Vite** fast build & HMR
- **Redux** for state management (avoid prop drilling)
- **React Router v6** code splitting
- **Lazy loading** for map tiles (Leaflet)

---

## Security Measures

### Authentication & Authorization
- JWT tokens (24-hour expiration)
- BCrypt password hashing (strength 10)
- Role-based access control (RBAC)
- @PreAuthorize annotations on endpoints

### Data Protection
- HTTPS ready (Docker configuration)
- SQL injection prevention (JPA parameterized queries)
- CORS configured for frontend origin
- Environment variables for secrets (JWT_SECRET, DB credentials)

### Spatial Data
- PostGIS enforces SRID 4326 (WGS84)
- Polygon validation on parcel creation
- Boundary checks for spatial operations

---

## Future Enhancements

### Planned Features
1. Real-time satellite data integration
2. AI-powered crop prediction
3. Weather anomaly alerts
4. Mobile app (React Native)
5. Advanced reporting exports (PDF, Excel)
6. Multi-language support
7. Performance analytics dashboard
8. Historical trend analysis

### Architecture Improvements
1. Microservices decomposition
2. Event-driven architecture (Kafka)
3. Elasticsearch for full-text search
4. Redis caching layer
5. GraphQL API option
6. Kubernetes deployment

---

## Repository Links

- **GitHub**: https://github.com/hemanthsai1849-eng/Sowing-Assessment.git
- **API Docs**: http://localhost:8080/swagger-ui.html (when running)
- **Frontend**: http://localhost:3000 (when running)

---

**Document Generated**: May 27, 2026  
**Project Version**: 1.0.0  
**Status**: Production Ready ✅
