/**
 * Advanced GIS Analysis Utilities
 * Spatial analysis, buffering, and multi-layer queries
 */

import { Feature, FeatureCollection, Point, Polygon, LineString, GeoJsonObject } from 'geojson';

export interface BufferOptions {
  radius: number; // in kilometers
  steps?: number;
}

export interface ProximityResult {
  parcelId: string;
  distance: number; // in kilometers
  bearing: number; // in degrees
  nearbyParcels: string[];
}

export interface IntersectionResult {
  parcelId: string;
  basin: string;
  area: number;
  percentageInBasin: number;
}

export interface NDVIChangeAnalysis {
  parcelId: string;
  startDate: string;
  endDate: string;
  startNDVI: number;
  endNDVI: number;
  change: number;
  changePercentage: number;
  trend: 'improving' | 'declining' | 'stable';
}

/**
 * Calculate distance between two geographic points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate bearing between two points
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos(dLon);
  const bearing = Math.atan2(y, x);
  return (bearing * 180) / Math.PI;
}

/**
 * Create a buffer polygon around a point
 */
export function bufferPoint(
  latitude: number,
  longitude: number,
  radiusKm: number
): Feature<Polygon> {
  const latOffset = radiusKm / 111.32; // 1 degree of latitude ≈ 111.32 km
  const lonOffset = radiusKm / (111.32 * Math.cos((latitude * Math.PI) / 180));

  const steps = 32;
  const coordinates: [number, number][] = [];

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = lonOffset * Math.cos(angle);
    const dy = latOffset * Math.sin(angle);
    coordinates.push([longitude + dx, latitude + dy]);
  }

  // Close the ring
  coordinates.push(coordinates[0]);

  return {
    type: 'Feature',
    properties: {
      radius: radiusKm,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  };
}

/**
 * Check if a point is within a polygon (ray casting algorithm)
 */
export function pointInPolygon(
  latitude: number,
  longitude: number,
  polygon: [number, number][]
): boolean {
  let inside = false;
  const x = longitude;
  const y = latitude;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Find nearby parcels within a certain radius
 */
export function findNearbyParcels(
  referenceParcel: any,
  allParcels: any[],
  radiusKm: number
): ProximityResult {
  const [refLon, refLat] = referenceParcel.geometry.coordinates[0][0];
  const nearbyParcels: { id: string; distance: number }[] = [];

  allParcels.forEach((parcel) => {
    if (parcel.id === referenceParcel.id) return;

    const [lon, lat] = parcel.geometry.coordinates[0][0];
    const distance = calculateDistance(refLat, refLon, lat, lon);

    if (distance <= radiusKm) {
      nearbyParcels.push({
        id: parcel.id,
        distance,
      });
    }
  });

  const sorted = nearbyParcels.sort((a, b) => a.distance - b.distance);

  return {
    parcelId: referenceParcel.id,
    distance: radiusKm,
    bearing: calculateBearing(refLat, refLon, refLat, refLon),
    nearbyParcels: sorted.map((p) => p.id),
  };
}

/**
 * Analyze NDVI temporal changes
 */
export function analyzeNDVIChange(
  parcelId: string,
  startNDVI: number,
  endNDVI: number,
  startDate: string,
  endDate: string
): NDVIChangeAnalysis {
  const change = endNDVI - startNDVI;
  const changePercentage = (change / startNDVI) * 100;

  let trend: 'improving' | 'declining' | 'stable';
  if (Math.abs(change) < 0.05) {
    trend = 'stable';
  } else if (change > 0) {
    trend = 'improving';
  } else {
    trend = 'declining';
  }

  return {
    parcelId,
    startDate,
    endDate,
    startNDVI,
    endNDVI,
    change,
    changePercentage,
    trend,
  };
}

/**
 * Calculate intersection area between parcel and river basin
 * Simplified calculation using buffer and overlap estimation
 */
export function calculateBasinIntersection(
  parcelArea: number,
  parcelNDVI: number,
  isInBasin: boolean
): IntersectionResult {
  const intersectionPercentage = isInBasin ? 0.85 : 0.15; // Simplified logic
  const intersectionArea = parcelArea * intersectionPercentage;

  return {
    parcelId: '',
    basin: isInBasin ? 'Krishna' : 'Godavari',
    area: intersectionArea,
    percentageInBasin: intersectionPercentage * 100,
  };
}

/**
 * Cluster nearby parcels by spatial proximity
 */
export function clusterParcels(
  parcels: any[],
  radiusKm: number
): Map<string, string[]> {
  const clusters = new Map<string, string[]>();
  const processed = new Set<string>();

  parcels.forEach((parcel) => {
    if (processed.has(parcel.id)) return;

    const cluster: string[] = [parcel.id];
    processed.add(parcel.id);

    const [lon, lat] = parcel.geometry.coordinates[0][0];

    parcels.forEach((otherParcel) => {
      if (processed.has(otherParcel.id)) return;

      const [otherLon, otherLat] = otherParcel.geometry.coordinates[0][0];
      const distance = calculateDistance(lat, lon, otherLat, otherLon);

      if (distance <= radiusKm) {
        cluster.push(otherParcel.id);
        processed.add(otherParcel.id);
      }
    });

    if (cluster.length > 1) {
      clusters.set(parcel.id, cluster);
    }
  });

  return clusters;
}

/**
 * Calculate area of a polygon in square kilometers
 * Uses simplified shoelace formula
 */
export function calculatePolygonArea(coordinates: [number, number][]): number {
  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area +=
      coordinates[i][0] * coordinates[j][1] - coordinates[j][0] * coordinates[i][1];
  }

  area = Math.abs(area) / 2;
  // Convert from degrees squared to approximate km²
  const avgLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / n;
  const latFactor = 111.32; // km per degree latitude
  const lonFactor = 111.32 * Math.cos((avgLat * Math.PI) / 180); // km per degree longitude

  return (area * latFactor * lonFactor) / 2;
}

/**
 * Find parcels within a specific NDVI range
 */
export function filterByNDVIRange(
  parcels: any[],
  minNDVI: number,
  maxNDVI: number
): any[] {
  return parcels.filter(
    (p) => p.ndviValue && p.ndviValue >= minNDVI && p.ndviValue <= maxNDVI
  );
}

/**
 * Identify anomalous parcels (unusual NDVI values)
 */
export function identifyAnomalies(parcels: any[], stdDevThreshold: number = 2) {
  const ndviValues = parcels
    .filter((p) => p.ndviValue)
    .map((p) => p.ndviValue);

  if (ndviValues.length === 0) return [];

  const mean = ndviValues.reduce((a, b) => a + b) / ndviValues.length;
  const variance =
    ndviValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) /
    ndviValues.length;
  const stdDev = Math.sqrt(variance);

  return parcels.filter(
    (p) =>
      p.ndviValue &&
      (p.ndviValue > mean + stdDev * stdDevThreshold ||
        p.ndviValue < mean - stdDev * stdDevThreshold)
  );
}

/**
 * Calculate spatial statistics for a parcel group
 */
export function calculateGroupStatistics(parcels: any[]) {
  const validNDVI = parcels.filter((p) => p.ndviValue).map((p) => p.ndviValue);
  const totalArea = parcels.reduce((sum, p) => sum + (p.areaHa || 0), 0);
  const croppedCount = parcels.filter((p) => p.currentStatus === 'CROPPED').length;
  const fallowCount = parcels.filter((p) => p.currentStatus === 'FALLOW').length;

  return {
    count: parcels.length,
    totalArea,
    avgNDVI: validNDVI.length > 0 ? validNDVI.reduce((a, b) => a + b) / validNDVI.length : 0,
    minNDVI: validNDVI.length > 0 ? Math.min(...validNDVI) : 0,
    maxNDVI: validNDVI.length > 0 ? Math.max(...validNDVI) : 0,
    croppedPercentage: (croppedCount / parcels.length) * 100,
    fallowPercentage: (fallowCount / parcels.length) * 100,
  };
}
