package com.ap.agri.cropmonitoring.modules.monitoring.controllers;

import com.ap.agri.cropmonitoring.modules.monitoring.dtos.NDVITimeSeriesResponse;
import com.ap.agri.cropmonitoring.modules.monitoring.services.NDVIService;
import com.ap.agri.cropmonitoring.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * REST API Controller for NDVI (Normalized Difference Vegetation Index) monitoring
 * Provides endpoints for retrieving vegetation health data over time
 */
@RestController
@RequestMapping("/api/v1/ndvi")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "NDVI Monitoring Service", description = "Vegetation health monitoring using satellite NDVI indices. Provides time-series analysis, heatmaps, and trend detection.")
public class NDVIController {

    private final NDVIService ndviService;

    public NDVIController(NDVIService ndviService) {
        this.ndviService = ndviService;
    }

    /**
     * Get NDVI time-series data for a specific parcel
     * Shows evolution of vegetation health over time with statistical analysis
     * 
     * @param parcelId The ID of the parcel
     * @param startDate Optional start date for the time series (format: yyyy-MM-dd)
     * @param endDate Optional end date for the time series (format: yyyy-MM-dd)
     * @return NDVITimeSeriesResponse with data points and trend analysis
     */
    @GetMapping("/parcel/{parcelId}/timeseries")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(
        summary = "Get NDVI Time-Series for Parcel",
        description = "Retrieves historical NDVI (vegetation health index) measurements for a parcel. " +
                      "Includes statistical summary (min/max/avg) and trend direction. " +
                      "Default range is last 6 months if dates not specified."
    )
    public ResponseEntity<ApiResponse<NDVITimeSeriesResponse>> getParcelTimeSeries(
            @PathVariable Long parcelId,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        NDVITimeSeriesResponse response = ndviService.getTimeSeriesData(parcelId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(
                response, 
                "NDVI time-series retrieved successfully for parcel " + parcelId));
    }

    /**
     * Get latest NDVI heatmap for an entire district
     * Shows spatial distribution of vegetation health across all parcels
     * 
     * @param districtId The ID of the district
     * @param dateFilter Optional date to filter records (defaults to today)
     * @return GeoJSON FeatureCollection with heatmap styling
     */
    @GetMapping("/heatmap/district/{districtId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(
        summary = "Get NDVI Heatmap for District",
        description = "Generates a GeoJSON heatmap showing NDVI (vegetation health) distribution across all parcels " +
                      "in a district. Color-coded from red (poor) to dark green (healthy). " +
                      "Default date is today if not specified."
    )
    public ResponseEntity<ApiResponse<String>> getDistrictNDVIHeatmap(
            @PathVariable Long districtId,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFilter) {
        
        ndviService.getDistrictNDVIHeatmap(districtId, dateFilter);
        
        // TODO: Implement GeoJSON generation
        return ResponseEntity.ok(ApiResponse.success(
                "{\"type\": \"FeatureCollection\", \"features\": []}",
                "NDVI heatmap generated for district " + districtId));
    }
}
