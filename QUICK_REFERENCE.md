# 📚 Quick Reference Guide - Sowing Assessment System

## Table of Contents
1. [Folder Structure Quick Map](#folder-structure-quick-map)
2. [API Endpoints Reference](#api-endpoints-reference)
3. [Database Tables Quick Reference](#database-tables-quick-reference)
4. [Key File Locations](#key-file-locations)
5. [Development Commands](#development-commands)
6. [Default Credentials](#default-credentials)
7. [Common Tasks](#common-tasks)

---

## Folder Structure Quick Map

### Backend Source Code
```
src/main/java/com/ap/agri/cropmonitoring/
├── CropMonitoringApplication.java         ← Spring Boot entry point
├── config/
│   ├── OpenApiConfig.java                 ← Swagger/OpenAPI config
│   └── security/
│       ├── SecurityConfig.java            ← Spring Security
│       ├── JwtTokenProvider.java          ← JWT generation
│       └── JwtAuthenticationFilter.java    ← JWT validation
│
└── modules/
    ├── auth/                              ← User authentication
    │   ├── controllers/AuthController.java
    │   ├── services/AuthService.java
    │   ├── entities/User.java, Role.java
    │   ├── dtos/AuthRequest.java, AuthResponse.java
    │   └── repositories/UserRepository.java, RoleRepository.java
    │
    ├── parcel/                            ← Land parcel management
    │   ├── controllers/ParcelController.java
    │   ├── services/ParcelService.java
    │   ├── entities/Parcel.java, District.java, Mandal.java, Village.java
    │   └── repositories/ParcelRepository.java, DistrictRepository.java, etc.
    │
    ├── monitoring/                        ← Satellite & NDVI data
    │   ├── entities/SatelliteObservation.java, NDVIRecord.java, CropSeason.java
    │   └── repositories/
    │
    ├── classification/                    ← NDVI classification engine
    │   ├── controllers/CropClassificationController.java
    │   └── services/CropClassificationService.java
    │
    ├── analytics/                         ← Reporting & analytics
    │   ├── controllers/AnalyticsController.java
    │   └── services/AnalyticsService.java
    │
    ├── epanta/                            ← Government validation
    │   ├── controllers/EPantaValidationController.java
    │   ├── entities/EPantaRecord.java
    │   └── repositories/EPantaRecordRepository.java
    │
    ├── alerts/                            ← Alert system
    │   ├── entities/Alert.java
    │   └── repositories/AlertRepository.java
    │
    ├── soil/                              ← Soil data
    │   └── entities/SoilData.java
    │
    ├── weather/                           ← Weather data
    │   └── entities/WeatherData.java
    │
    └── shared/                            ← Common utilities
        ├── dto/ApiResponse.java
        ├── exception/
        └── utils/
```

### Database
```
src/main/resources/
├── application.properties                 ← Main config (port 8080, DB, JWT)
├── application-dev.properties             ← Dev environment config
└── db/migration/
    └── V1__init_schema.sql                ← Database schema (13 tables)
```

### Frontend Source Code
```
frontend/src/
├── main.tsx                               ← React entry point
├── App.tsx                                ← Root router component
│
├── pages/                                 ← Full-page views
│   ├── Dashboard.tsx                      ← Main GIS dashboard
│   ├── FallowAnalysis.tsx                 ← Fallow detection analysis
│   ├── EPantaComparison.tsx               ← Government validation
│   ├── RiverBasinIntelligence.tsx         ← Basin analytics
│   ├── SpatialAnalysis.tsx                ← Advanced queries
│   ├── Settings.tsx                       ← Configuration
│   └── Login.tsx                          ← Authentication
│
├── components/                            ← Reusable components
│   ├── MapContainer.tsx                   ← Leaflet GIS map
│   ├── Sidebar.tsx                        ← Navigation panel
│   ├── AnalyticsPanel.tsx                 ← Dashboard charts
│   ├── ParcelSearch.tsx                   ← Search UI
│   ├── NDVITimeSeries.tsx                 ← Time-series chart
│   ├── DraggableLegend.tsx                ← Interactive legend
│   │
│   ├── layers/                            ← Map layer components
│   │   ├── ParcelLayer.tsx
│   │   ├── RiverLayer.tsx
│   │   ├── NDVILayer.tsx
│   │   ├── FallowLayer.tsx
│   │   └── DistrictLayer.tsx
│   │
│   └── controls/                          ← Map control components
│       ├── LayerControl.tsx
│       └── LegendControl.tsx
│
├── store/                                 ← Redux state management
│   ├── index.ts                           ← Store config
│   ├── mapSlice.ts                        ← Map state (center, zoom, layers)
│   └── dataSlice.ts                       ← Data state (parcels, alerts)
│
├── services/                              ← API integration
│   └── api.ts                             ← Axios instance, endpoints
│
├── hooks/                                 ← Custom React hooks
│   ├── useAppRedux.ts                     ← Typed Redux hooks
│   └── useGeolocation.ts                  ← Browser geolocation
│
├── types/                                 ← TypeScript interfaces
│   └── index.ts                           ← Shared type definitions
│
├── data/                                  ← Static GeoJSON data
│   ├── boundaries.ts                      ← District/mandal boundaries
│   ├── parcels.ts                         ← Sample parcels
│   └── rivers.ts                          ← Krishna & Godavari
│
└── styles/                                ← CSS & Tailwind
    └── globals.css                        ← Global styles
```

### Configuration Files (Root)
```
├── pom.xml                                ← Maven dependencies & plugins
├── Dockerfile                             ← Backend multi-stage build
├── docker-compose.yml                     ← Full stack (DB + Backend + PgAdmin)
├── docker-compose.frontend.yml            ← Frontend only
│
├── mvnw.cmd                               ← Maven wrapper (Windows)
├── README.md                              ← Main project README
├── PROJECT_README.md                      ← Detailed project info
├── FEATURE_MATRIX.md                      ← Feature completeness
├── FRONTEND_SUMMARY.md                    ← Frontend implementation
├── IMPLEMENTATION_COMPLETE.md             ← Completion status
├── REPOSITORY_EXPLORATION.md              ← This repo guide
└── ARCHITECTURE_DIAGRAMS.md               ← System diagrams
```

### Frontend Configuration
```
frontend/
├── index.html                             ← HTML template
├── package.json                           ← npm dependencies
├── tsconfig.json                          ← TypeScript config
├── vite.config.ts                         ← Vite build config
├── tailwind.config.cjs                    ← Tailwind CSS config
├── postcss.config.cjs                     ← PostCSS plugins
└── Dockerfile                             ← Frontend container
```

### Utilities & Documentation
```
scratch/
├── setup_project_db.sql                   ← Database setup
├── enable_postgis.sql                     ← PostGIS extension
├── test_api.ps1                           ← API testing script
├── TestBCrypt.java                        ← Password hashing test
│
└── payloads/                              ← API request samples
    ├── auth_payload.json
    ├── epanta_payload.json
    ├── parcel_payload.json
    └── satellite_payload.json

frontend/
├── README.md                              ← Frontend docs
├── QUICK_START.md                         ← 5-minute setup
├── SETUP.md                               ← Detailed setup
└── DEPLOY.md                              ← Deployment guides
```

---

## API Endpoints Reference

### Base URL
```
Development: http://localhost:8080/api/v1
Production: https://your-domain.com/api/v1
```

### Authentication (Public)
```
POST /auth/login
  Body: { username: string, password: string }
  Response: { token: string, expiresIn: number }
  Example: POST /api/v1/auth/login
```

### Parcel Management (Protected: ADMIN, OFFICER, ANALYST)
```
GET /parcels/{id}
  Get parcel details
  Auth: All roles
  Example: GET /api/v1/parcels/123

GET /parcels/village/{villageId}
  List parcels in village
  Auth: All roles
  Example: GET /api/v1/parcels/village/456

POST /parcels
  Create new parcel
  Auth: ADMIN, OFFICER only
  Body: { surveyNumber, farmerName, areaHa, boundary (GeoJSON) }
```

### Crop Classification (Protected: ADMIN, ANALYST)
```
POST /classification/trigger
  Classify single parcel
  Auth: ADMIN, ANALYST
  Params: parcelId, meanNdvi, observationId (optional)
  Example: POST /api/v1/classification/trigger?parcelId=123&meanNdvi=0.65

POST /classification/batch/satellite/{observationId}
  Batch classify parcels under satellite tile
  Auth: ADMIN, ANALYST
  Example: POST /api/v1/classification/batch/satellite/789
```

### Analytics (Protected: ADMIN, OFFICER, ANALYST)
```
GET /analytics/district/{districtId}
  District intelligence dashboard
  Auth: All roles
  Returns: Aggregated stats (total parcels, hectares, sowing %)
  Example: GET /api/v1/analytics/district/1

GET /analytics/mandal/{mandalId}
  Mandal intelligence dashboard
  Auth: All roles
  Example: GET /api/v1/analytics/mandal/42
```

### e-Panta Validation (Protected: ADMIN, OFFICER, ANALYST)
```
GET /epanta/verify/{parcelId}
  Verify parcel against government e-Panta records
  Auth: All roles
  Example: GET /api/v1/epanta/verify/123
```

### Swagger/OpenAPI Documentation
```
Swagger UI: http://localhost:8080/swagger-ui.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
```

---

## Database Tables Quick Reference

### Authentication & Users
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| **roles** | id, name (ADMIN/OFFICER/ANALYST) | User roles |
| **users** | id, username, password (BCrypt), email, role_id | User accounts |

### Geographic Hierarchy
| Table | Key Columns | Spatial | Purpose |
|-------|-------------|---------|---------|
| **districts** | id, name, code, boundary | MultiPolygon | State districts |
| **mandals** | id, district_id, name, boundary | MultiPolygon | Sub-districts |
| **villages** | id, mandal_id, name, boundary | MultiPolygon | Villages |
| **parcels** | id, village_id, survey_number, boundary | Polygon | Agricultural land |

### Satellite & Vegetation
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| **satellite_observations** | id, sensor_name, cloud_cover, tile_boundary | Satellite passes |
| **ndvi_records** | id, parcel_id, observation_id, mean_ndvi, classification_status | Vegetation index |
| **crop_seasons** | id, name (KHARIF/RABI/ZAID), year, start_date, end_date | Crop seasons |

### Supporting Data
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| **soil_data** | id, parcel_id, pH, nitrogen, phosphorus, potassium | Soil properties |
| **weather_data** | id, village_id, record_date, temp_min, temp_max, precipitation | Weather records |
| **e_panta_records** | id, parcel_id, season_id, crop_name, verification_status | Government records |
| **alerts** | id, parcel_id, alert_type, message, resolved | System alerts |

### Status Values
```
Parcel Status: CROPPED | LIKELY_CROPPED | FALLOW
NDVI Classification: CROPPED | LIKELY_CROPPED | FALLOW
EPanta Verification: VERIFIED | PENDING | REJECTED
Alert Types: MISMATCH_FOUND | CRITICAL_FALLOW | WEATHER_ANOMALY
Crop Seasons: KHARIF | RABI | ZAID
```

---

## Key File Locations

### Authentication
- **JWT Config**: `src/main/java/.../config/security/JwtTokenProvider.java`
- **Spring Security**: `src/main/java/.../config/security/SecurityConfig.java`
- **JWT Filter**: `src/main/java/.../config/security/JwtAuthenticationFilter.java`
- **User Entity**: `src/main/java/.../modules/auth/entities/User.java`

### Data Models
- **Parcel Entity**: `src/main/java/.../modules/parcel/entities/Parcel.java`
- **NDVI Record**: `src/main/java/.../modules/monitoring/entities/NDVIRecord.java`
- **Satellite Observation**: `src/main/java/.../modules/monitoring/entities/SatelliteObservation.java`
- **e-Panta Record**: `src/main/java/.../modules/epanta/entities/EPantaRecord.java`
- **Alert**: `src/main/java/.../modules/alerts/entities/Alert.java`

### Business Logic
- **Classification Service**: `src/main/java/.../modules/classification/services/CropClassificationService.java`
- **Analytics Service**: `src/main/java/.../modules/analytics/services/AnalyticsService.java`
- **e-Panta Service**: `src/main/java/.../modules/epanta/services/EPantaValidationService.java`

### Controllers
- **ParcelController**: `src/main/java/.../modules/parcel/controllers/ParcelController.java`
- **ClassificationController**: `src/main/java/.../modules/classification/controllers/CropClassificationController.java`
- **AnalyticsController**: `src/main/java/.../modules/analytics/controllers/AnalyticsController.java`

### Database
- **Schema**: `src/main/resources/db/migration/V1__init_schema.sql`
- **Config**: `src/main/resources/application.properties`

### Frontend Pages
- **Dashboard**: `frontend/src/pages/Dashboard.tsx`
- **Fallow Analysis**: `frontend/src/pages/FallowAnalysis.tsx`
- **e-Panta Comparison**: `frontend/src/pages/EPantaComparison.tsx`
- **Settings**: `frontend/src/pages/Settings.tsx`

### Frontend Components
- **MapContainer**: `frontend/src/components/MapContainer.tsx`
- **Parcel Layer**: `frontend/src/components/layers/ParcelLayer.tsx`
- **Layer Control**: `frontend/src/components/controls/LayerControl.tsx`
- **Analytics Panel**: `frontend/src/components/AnalyticsPanel.tsx`

### Redux Store
- **Store Config**: `frontend/src/store/index.ts`
- **Map State**: `frontend/src/store/mapSlice.ts`
- **Data State**: `frontend/src/store/dataSlice.ts`

### API
- **API Service**: `frontend/src/services/api.ts`
- **Types**: `frontend/src/types/index.ts`

---

## Development Commands

### Backend (Java/Maven)

#### Build
```bash
mvn clean install                    # Full build
mvn clean compile                    # Compile only
mvn dependency:resolve               # Resolve dependencies
```

#### Run
```bash
mvn spring-boot:run                  # Run Spring Boot app
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"  # Debug mode
```

#### Test
```bash
mvn test                             # Run unit tests
mvn clean verify                     # Build + test
```

#### Package
```bash
mvn clean package -DskipTests        # Create JAR
mvn clean package                    # Create JAR with tests
```

### Frontend (React/Node.js)

#### Setup
```bash
cd frontend
npm install                          # Install dependencies
```

#### Development
```bash
npm run dev                          # Start Vite dev server (port 3000)
npm run build                        # Build for production
npm run preview                      # Preview production build
npm run type-check                   # TypeScript type checking
npm run lint                         # Run ESLint
```

### Docker

#### Build
```bash
# Backend
docker build -t crop-sowing-intelligence:1.0.0 .

# Frontend
docker build -t crop-sowing-intelligence-frontend:1.0.0 frontend/
```

#### Run
```bash
# Full stack (DB + Backend + PgAdmin)
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f app          # Backend logs
docker-compose logs -f db           # Database logs

# Frontend only
docker-compose -f docker-compose.frontend.yml up -d
```

### Database

#### Initialize
```bash
# Using Docker (recommended)
docker-compose up -d db
docker-compose exec db psql -U ap_agri_admin -d crop_monitoring_db < src/main/resources/db/migration/V1__init_schema.sql

# Manual PostgreSQL
createdb crop_monitoring_db
psql crop_monitoring_db < src/main/resources/db/migration/V1__init_schema.sql
```

#### Access
```bash
# Docker container
docker-compose exec db psql -U ap_agri_admin -d crop_monitoring_db

# Local
psql -U postgres -d crop_monitoring_db

# PgAdmin web UI
http://localhost:5050
# Email: admin@ap.gov.in
# Password: PgAdminPassword2026
```

---

## Default Credentials

### Application Users
| Username | Password | Role | Purpose |
|----------|----------|------|---------|
| ap_admin | admin123 | ADMIN | Full system access |
| ap_officer | admin123 | OFFICER | Operational tasks |
| ap_analyst | admin123 | ANALYST | Analysis & reporting |

### Database
| User | Password | Database |
|------|----------|----------|
| ap_agri_admin | AgriSecurePassword2026 | crop_monitoring_db |
| postgres | springstudent | (default) |

### PgAdmin
| Email | Password |
|-------|----------|
| admin@ap.gov.in | PgAdminPassword2026 |

### JWT Configuration
```
Secret: 9a6Zp0Wv2BxYc4DeFgHiJkLmNoPqRsTuVwXyZ1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
Expiration: 86400000 ms (24 hours)
Header: Authorization
Prefix: Bearer
```

---

## Common Tasks

### Add New User (Database)
```sql
INSERT INTO users (username, password, email, full_name, role_id, active)
VALUES (
  'new_user',
  '$2a$10$<bcrypt_hash>', -- Use TestBCrypt.java to generate
  'user@ap.gov.in',
  'User Full Name',
  2,  -- OFFICER role (1=ADMIN, 2=OFFICER, 3=ANALYST)
  TRUE
);
```

### Create Parcel Entry
```json
POST /api/v1/parcels
{
  "surveyNumber": "12-34-56",
  "farmerName": "Farmer Name",
  "areaHa": 2.5,
  "boundary": {
    "type": "Polygon",
    "coordinates": [
      [[78.1, 15.2], [78.11, 15.2], [78.11, 15.21], [78.1, 15.21], [78.1, 15.2]]
    ]
  }
}
```

### Classify Parcel by NDVI
```
POST /api/v1/classification/trigger?parcelId=123&meanNdvi=0.65
Response: "CROPPED" | "LIKELY_CROPPED" | "FALLOW"
```

### Get District Analytics
```
GET /api/v1/analytics/district/1
Response:
{
  "totalParcels": 5000,
  "totalHectares": 12500,
  "croppedCount": 3500,
  "croppedPercentage": 70,
  "fallowCount": 1500,
  "fallowPercentage": 30,
  "likelyCroppedCount": 0,
  "likelyCroppedPercentage": 0
}
```

### Query Parcels by Status
```sql
SELECT * FROM parcels WHERE current_status = 'FALLOW' LIMIT 100;
```

### Check NDVI History for Parcel
```sql
SELECT * FROM ndvi_records 
WHERE parcel_id = 123 
ORDER BY processed_at DESC 
LIMIT 10;
```

### View Active Alerts
```sql
SELECT * FROM alerts 
WHERE resolved = FALSE 
ORDER BY created_at DESC;
```

### Generate New JWT Token (Testing)
```bash
# Using cURL
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ap_admin","password":"admin123"}'
```

### Update Application Port
```properties
# src/main/resources/application.properties
server.port=9090
```

### Change Database Connection
```properties
spring.datasource.url=jdbc:postgresql://your-db-host:5432/your_db
spring.datasource.username=your_user
spring.datasource.password=your_password
```

### Enable SQL Query Logging
```properties
spring.jpa.properties.hibernate.show_sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Reset Database
```bash
# Using Docker
docker-compose down -v  # Remove volumes
docker-compose up -d db
# Then reinitialize schema
```

---

## Performance Tips

### Backend
- ✅ Spatial indexes created on polygon boundaries (GIST)
- ✅ HikariCP connection pool (max 15)
- ✅ Batch fetch size set to 30
- ✅ JWT caching enabled
- ✅ G1GC garbage collector

### Frontend
- ✅ Vite for fast development builds
- ✅ Code splitting with React Router
- ✅ Lazy loading map tiles
- ✅ Redux for centralized state
- ✅ TailwindCSS production build

### Database
- ✅ GIST spatial indexes on boundaries
- ✅ B-tree indexes on foreign keys
- ✅ Connection pooling (HikariCP)
- ✅ Query optimization hints

---

## Useful Links

- **GitHub**: https://github.com/hemanthsai1849-eng/Sowing-Assessment.git
- **Swagger API Docs**: http://localhost:8080/swagger-ui.html
- **Frontend Dev**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **PgAdmin**: http://localhost:5050
- **PostgreSQL**: localhost:5432

---

## Troubleshooting

### Backend Won't Start
```bash
# Check port 8080 is free
lsof -i :8080

# Check database connectivity
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"

# Check pom.xml dependencies
mvn clean dependency:resolve
```

### Frontend Won't Start
```bash
# Clear node_modules
rm -rf frontend/node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf frontend/.vite

# Check port 3000 is free
lsof -i :3000
```

### Database Connection Issues
```bash
# Verify database is running
docker ps | grep postgis

# Test connection
psql -U ap_agri_admin -d crop_monitoring_db -h localhost

# Check Docker logs
docker-compose logs db
```

### JWT Token Expired
```
HTTP 401: Unauthorized
Solution: Login again to get new token (24-hour expiration)
```

### CORS Issues
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: 
1. Ensure frontend proxy is configured (vite.config.ts)
2. Check SecurityConfig.java CORS settings
3. Use Authorization header for JWT
```

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0
