package com.ap.agri.cropmonitoring.modules.classification.controllers;

import com.ap.agri.cropmonitoring.modules.classification.services.CropClassificationService;
import com.ap.agri.cropmonitoring.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/classification")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Crop Classification Engine", description = "AI/Heuristic NDVI rules processor and spatial batch pipeline trigger.")
public class CropClassificationController {

    private final CropClassificationService cropClassificationService;

    public CropClassificationController(CropClassificationService cropClassificationService) {
        this.cropClassificationService = cropClassificationService;
    }

    @PostMapping("/trigger")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    @Operation(summary = "Classify Single Parcel", description = "Manually triggers vegetation analysis and classification on a specific parcel using NDVI values. Restricted to Admins/Analysts.")
    public ResponseEntity<ApiResponse<String>> classifyParcel(
            @RequestParam Long parcelId,
            @RequestParam double meanNdvi,
            @RequestParam(required = false) Long observationId) {
        
        String result = cropClassificationService.classifyParcel(parcelId, meanNdvi, observationId);
        return ResponseEntity.ok(ApiResponse.success(result, "Classification completed. Status updated to: " + result));
    }

    @PostMapping("/batch/satellite/{observationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    @Operation(summary = "Batch Spatial Classification", description = "Spatial Pipeline: Automatically detects all parcels covered by a satellite tile boundary, simulates NDVI analysis, evaluates rules, and logs classifications.")
    public ResponseEntity<ApiResponse<Integer>> processSatelliteObservationBatch(@PathVariable Long observationId) {
        int processedCount = cropClassificationService.classifyParcelsUnderSatelliteTile(observationId);
        return ResponseEntity.ok(ApiResponse.success(processedCount, 
                "Batch spatial classification completed. Evaluated " + processedCount + " land parcels."));
    }
}
