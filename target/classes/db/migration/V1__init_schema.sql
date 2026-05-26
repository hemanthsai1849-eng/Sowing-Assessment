-- V1__init_schema.sql
-- Database initialization for Automated Crop Sowing Monitoring and Fallow Land Intelligence System

-- Enable PostGIS spatial extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Roles Table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- 2. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role_id BIGINT REFERENCES roles(id) ON DELETE RESTRICT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Districts Table
CREATE TABLE districts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL
);

-- 4. Mandals Table
CREATE TABLE mandals (
    id BIGSERIAL PRIMARY KEY,
    district_id BIGINT REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    CONSTRAINT unique_mandal_district UNIQUE(district_id, name)
);

-- 5. Villages Table
CREATE TABLE villages (
    id BIGSERIAL PRIMARY KEY,
    mandal_id BIGINT REFERENCES mandals(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    CONSTRAINT unique_village_mandal UNIQUE(mandal_id, name)
);

-- 6. Crop Seasons Table
CREATE TABLE crop_seasons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'KHARIF', 'RABI', 'ZAID'
    year INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_season_year UNIQUE(name, year)
);

-- 7. Parcels Table
CREATE TABLE parcels (
    id BIGSERIAL PRIMARY KEY,
    village_id BIGINT REFERENCES villages(id) ON DELETE CASCADE,
    survey_number VARCHAR(50) NOT NULL,
    farmer_name VARCHAR(100) NOT NULL,
    area_ha NUMERIC(10, 4) NOT NULL,
    boundary GEOMETRY(Polygon, 4326) NOT NULL,
    current_status VARCHAR(50) DEFAULT 'FALLOW', -- 'CROPPED', 'LIKELY_CROPPED', 'FALLOW'
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_parcel_survey UNIQUE(village_id, survey_number)
);

-- 8. Satellite Observations Table
CREATE TABLE satellite_observations (
    id BIGSERIAL PRIMARY KEY,
    sensor_name VARCHAR(50) NOT NULL, -- 'SENTINEL-2', 'LANDSAT-8'
    cloud_cover NUMERIC(5, 2) NOT NULL,
    acquisition_date TIMESTAMP NOT NULL,
    tile_boundary GEOMETRY(Polygon, 4326) NOT NULL,
    file_path VARCHAR(255)
);

-- 9. NDVI Records Table
CREATE TABLE ndvi_records (
    id BIGSERIAL PRIMARY KEY,
    parcel_id BIGINT REFERENCES parcels(id) ON DELETE CASCADE,
    observation_id BIGINT REFERENCES satellite_observations(id) ON DELETE SET NULL,
    mean_ndvi NUMERIC(5, 4) NOT NULL,
    max_ndvi NUMERIC(5, 4) NOT NULL,
    classification_status VARCHAR(50) NOT NULL, -- 'CROPPED', 'LIKELY_CROPPED', 'FALLOW'
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Soil Data Table
CREATE TABLE soil_data (
    id BIGSERIAL PRIMARY KEY,
    parcel_id BIGINT REFERENCES parcels(id) ON DELETE CASCADE,
    ph NUMERIC(4, 2) NOT NULL,
    nitrogen NUMERIC(8, 2) NOT NULL, -- kg/ha
    phosphorus NUMERIC(8, 2) NOT NULL, -- kg/ha
    potassium NUMERIC(8, 2) NOT NULL, -- kg/ha
    organic_carbon NUMERIC(5, 2) NOT NULL, -- %
    soil_type VARCHAR(100) NOT NULL, -- 'Red Sandy', 'Black Cotton', etc.
    tested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Weather Data Table
CREATE TABLE weather_data (
    id BIGSERIAL PRIMARY KEY,
    village_id BIGINT REFERENCES villages(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    temp_min NUMERIC(4, 1) NOT NULL,
    temp_max NUMERIC(4, 1) NOT NULL,
    precipitation NUMERIC(6, 2) NOT NULL, -- mm
    soil_moisture NUMERIC(5, 2) NOT NULL, -- %
    CONSTRAINT unique_weather_village_date UNIQUE(village_id, record_date)
);

-- 12. e-Panta Records Table
CREATE TABLE e_panta_records (
    id BIGSERIAL PRIMARY KEY,
    parcel_id BIGINT REFERENCES parcels(id) ON DELETE CASCADE,
    season_id BIGINT REFERENCES crop_seasons(id) ON DELETE CASCADE,
    farmer_name VARCHAR(100) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    sown_area_ha NUMERIC(10, 4) NOT NULL,
    registration_date DATE NOT NULL,
    verification_status VARCHAR(50) NOT NULL, -- 'VERIFIED', 'PENDING', 'REJECTED'
    CONSTRAINT unique_epanta_parcel_season UNIQUE(parcel_id, season_id)
);

-- 13. Alerts Table
CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    parcel_id BIGINT REFERENCES parcels(id) ON DELETE CASCADE,
    season_id BIGINT REFERENCES crop_seasons(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'MISMATCH_FOUND', 'CRITICAL_FALLOW', 'WEATHER_ANOMALY'
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP
);

-- Spatial GIST Indexes for Ultra-Fast Spatial Operations
CREATE INDEX idx_districts_boundary ON districts USING GIST (boundary);
CREATE INDEX idx_mandals_boundary ON mandals USING GIST (boundary);
CREATE INDEX idx_villages_boundary ON villages USING GIST (boundary);
CREATE INDEX idx_parcels_boundary ON parcels USING GIST (boundary);
CREATE INDEX idx_satellite_obs_boundary ON satellite_observations USING GIST (tile_boundary);

-- Standard Functional Indexes
CREATE INDEX idx_parcels_village ON parcels(village_id);
CREATE INDEX idx_ndvi_parcel ON ndvi_records(parcel_id);
CREATE INDEX idx_epanta_parcel ON e_panta_records(parcel_id);
CREATE INDEX idx_weather_village ON weather_data(village_id);
CREATE INDEX idx_alerts_parcel ON alerts(parcel_id);

-- Seeding Default Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ADMIN', 'System administrator with full read/write privileges'),
(2, 'OFFICER', 'Agriculture Department officer with operational privileges'),
(3, 'ANALYST', 'GIS/Satellite analyst with read and trigger privileges');

-- Adjust sequences to avoid auto-increment collisions after explicit seeds
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));

-- Seeding Default Users (Password: 'admin123' BCrypt hashed)
-- BCrypt: $2a$10$NyurUGS.QZv1rDCkAhSTDObzkpk3ec8HXhBEolkNMaUixcNS3rX9a
INSERT INTO users (username, password, email, full_name, role_id, active) VALUES
('ap_admin', '$2a$10$NyurUGS.QZv1rDCkAhSTDObzkpk3ec8HXhBEolkNMaUixcNS3rX9a', 'admin@ap.gov.in', 'AP Agri Admin User', 1, TRUE),
('ap_officer', '$2a$10$NyurUGS.QZv1rDCkAhSTDObzkpk3ec8HXhBEolkNMaUixcNS3rX9a', 'officer@ap.gov.in', 'AP Agri Field Officer', 2, TRUE),
('ap_analyst', '$2a$10$NyurUGS.QZv1rDCkAhSTDObzkpk3ec8HXhBEolkNMaUixcNS3rX9a', 'analyst@ap.gov.in', 'AP Agri GIS Analyst', 3, TRUE);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Seeding Default Seasons
INSERT INTO crop_seasons (id, name, year, start_date, end_date, active) VALUES
(1, 'KHARIF', 2026, '2026-06-01', '2026-10-31', FALSE),
(2, 'RABI', 2026, '2026-11-01', '2027-03-31', TRUE);

SELECT setval('crop_seasons_id_seq', (SELECT MAX(id) FROM crop_seasons));
