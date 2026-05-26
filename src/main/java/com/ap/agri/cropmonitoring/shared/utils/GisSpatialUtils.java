package com.ap.agri.cropmonitoring.shared.utils;

import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.jts.io.geojson.GeoJsonReader;
import org.locationtech.jts.io.geojson.GeoJsonWriter;
import org.geotools.api.referencing.crs.CoordinateReferenceSystem;
import org.geotools.api.referencing.operation.MathTransform;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Enterprise GIS Spatial Utility Class
 * Leverages JTS (Java Topology Suite) and GeoTools for high-performance spatial transformations,
 * area calculations, GeoJSON import/export, and buffer operations.
 */
@Component
public class GisSpatialUtils {

    private static final Logger log = LoggerFactory.getLogger(GisSpatialUtils.class);

    private static final String EPSG_WGS84 = "EPSG:4326";
    // UTM Zone 44N (covers Andhra Pradesh, India) for precise metric distance/area calculations
    private static final String EPSG_UTM_44N = "EPSG:32644";

    private final WKTReader wktReader = new WKTReader();
    private final GeoJsonReader geoJsonReader = new GeoJsonReader();
    private final GeoJsonWriter geoJsonWriter = new GeoJsonWriter();

    /**
     * Parse WKT (Well-Known Text) string to JTS Geometry
     */
    public Geometry parseWkt(String wkt) {
        try {
            if (wkt == null || wkt.trim().isEmpty()) {
                return null;
            }
            return wktReader.read(wkt);
        } catch (Exception e) {
            log.error("Failed to parse WKT geometry: {}", wkt, e);
            throw new IllegalArgumentException("Invalid WKT geometry representation: " + e.getMessage());
        }
    }

    /**
     * Parse GeoJSON string to JTS Geometry
     */
    public Geometry parseGeoJson(String geoJson) {
        try {
            if (geoJson == null || geoJson.trim().isEmpty()) {
                return null;
            }
            // If the GeoJSON represents a full Feature, we extract the geometry block
            if (geoJson.contains("\"geometry\"")) {
                int geomStart = geoJson.indexOf("\"geometry\"");
                // Fast extraction for simple payload parsing
                String sub = geoJson.substring(geomStart);
                int typeStart = sub.indexOf("{");
                int braceCount = 1;
                int typeEnd = typeStart;
                for (int i = typeStart + 1; i < sub.length(); i++) {
                    if (sub.charAt(i) == '{') braceCount++;
                    else if (sub.charAt(i) == '}') braceCount--;
                    if (braceCount == 0) {
                        typeEnd = i;
                        break;
                    }
                }
                geoJson = sub.substring(typeStart, typeEnd + 1);
            }
            return geoJsonReader.read(geoJson);
        } catch (Exception e) {
            log.error("Failed to parse GeoJSON geometry: {}", geoJson, e);
            throw new IllegalArgumentException("Invalid GeoJSON geometry representation: " + e.getMessage());
        }
    }

    /**
     * Serialize JTS Geometry to GeoJSON string
     */
    public String toGeoJson(Geometry geometry) {
        try {
            if (geometry == null) {
                return null;
            }
            return geoJsonWriter.write(geometry);
        } catch (Exception e) {
            log.error("Failed to serialize Geometry to GeoJSON", e);
            return null;
        }
    }

    /**
     * Calculate boundary area in Hectares
     * Converts WGS84 (degrees) to UTM Zone 44N (meters) for precise metric measurement
     */
    public double calculateAreaInHectares(Geometry geom) {
        if (geom == null) {
            return 0.0;
        }
        try {
            CoordinateReferenceSystem sourceCRS = CRS.decode(EPSG_WGS84);
            CoordinateReferenceSystem targetCRS = CRS.decode(EPSG_UTM_44N);
            
            // Perform high-precision transformation
            MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);
            Geometry transformedGeom = JTS.transform(geom, transform);
            
            double areaInSqMeters = transformedGeom.getArea();
            double areaInHectares = areaInSqMeters / 10000.0; // 1 Hectare = 10,000 sq meters
            
            log.debug("Spatial area calculated: {} sq meters -> {} hectares", areaInSqMeters, areaInHectares);
            return Math.round(areaInHectares * 10000.0) / 10000.0; // Round to 4 decimal places
        } catch (Exception e) {
            log.warn("GeoTools transform failed, falling back to geographical approximation. Error: {}", e.getMessage());
            // Fallback: Andhra Pradesh latitude average (approx 16.5 degrees N).
            // Approximation: 1 degree latitude = 111,000 meters. 1 degree longitude = 106,000 meters.
            // Factor = 111000 * 106000 = 11,766,000,000 sq meters per sq degree.
            // In hectares: factor / 10000 = 1,176,600 hectares per sq degree.
            double rawArea = geom.getArea();
            double approxHectares = rawArea * 1176600.0;
            return Math.round(approxHectares * 10000.0) / 10000.0;
        }
    }

    /**
     * Creates a spatial buffer (in meters) around a geometry
     */
    public Geometry createBuffer(Geometry geom, double bufferInMeters) {
        if (geom == null) {
            return null;
        }
        try {
            CoordinateReferenceSystem wgs84 = CRS.decode(EPSG_WGS84);
            CoordinateReferenceSystem utm = CRS.decode(EPSG_UTM_44N);

            // 1. Project WGS84 -> UTM 44N (metric context)
            MathTransform transformToMetric = CRS.findMathTransform(wgs84, utm, true);
            Geometry metricGeom = JTS.transform(geom, transformToMetric);

            // 2. Buffer in metric context
            Geometry bufferedMetric = metricGeom.buffer(bufferInMeters);

            // 3. Project back UTM 44N -> WGS84
            MathTransform transformToGeographic = CRS.findMathTransform(utm, wgs84, true);
            return JTS.transform(bufferedMetric, transformToGeographic);
        } catch (Exception e) {
            log.warn("Spatial buffering projection failed. Falling back to degree buffering. Error: {}", e.getMessage());
            // Fallback: 1 meter is roughly 0.000009 degrees
            double degrees = bufferInMeters * 0.000009;
            return geom.buffer(degrees);
        }
    }

    /**
     * Check if geometry A intersects geometry B
     */
    public boolean intersects(Geometry a, Geometry b) {
        if (a == null || b == null) {
            return false;
        }
        return a.intersects(b);
    }

    /**
     * Returns the intersection geometry of two geometries
     */
    public Geometry getIntersection(Geometry a, Geometry b) {
        if (a == null || b == null) {
            return null;
        }
        return a.intersection(b);
    }
}
