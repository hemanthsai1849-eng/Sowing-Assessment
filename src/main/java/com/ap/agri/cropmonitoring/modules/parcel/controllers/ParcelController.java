package com.ap.agri.cropmonitoring.modules.parcel.controllers;

import com.ap.agri.cropmonitoring.modules.parcel.dtos.ParcelDto;
import com.ap.agri.cropmonitoring.modules.parcel.services.ParcelService;
import com.ap.agri.cropmonitoring.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/parcels")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Parcel Management Service", description = "Cadastral land holdings mapping, spatial intersections, and GeoJSON parcel uploads.")
public class ParcelController {

    private final ParcelService parcelService;

    public ParcelController(ParcelService parcelService) {
        this.parcelService = parcelService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Register Cadastral Parcel", description = "Uploads a new parcel's boundary (GeoJSON), validates Village boundaries, auto-calculates hectares, and saves it. Restricted to Admin/Officer.")
    public ResponseEntity<ApiResponse<ParcelDto>> createParcel(@Valid @RequestBody ParcelDto dto) {
        ParcelDto savedDto = parcelService.createParcel(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(savedDto, "Cadastral parcel registered successfully. Area automatically calculated in Hectares."));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(summary = "Get Parcel Details", description = "Returns details of a specific parcel including its boundaries formatted as GeoJSON.")
    public ResponseEntity<ApiResponse<ParcelDto>> getParcelById(@PathVariable Long id) {
        ParcelDto dto = parcelService.getParcelById(id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Parcel details retrieved."));
    }

    @GetMapping("/village/{villageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(summary = "List Parcels by Village", description = "Retrieves all registered parcels within a specific village ID.")
    public ResponseEntity<ApiResponse<List<ParcelDto>>> getParcelsByVillage(@PathVariable Long villageId) {
        List<ParcelDto> dtos = parcelService.getParcelsByVillage(villageId);
        return ResponseEntity.ok(ApiResponse.success(dtos, "Parcels retrieved successfully for village."));
    }

    @GetMapping("/spatial/within-mandal/{mandalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(summary = "Query Parcels Within Mandal Boundary", description = "Spatial Query: Fetches all parcels residing within a specific Mandal administrative boundary polygon.")
    public ResponseEntity<ApiResponse<List<ParcelDto>>> getParcelsWithinMandal(@PathVariable Long mandalId) {
        List<ParcelDto> dtos = parcelService.getParcelsWithinMandal(mandalId);
        return ResponseEntity.ok(ApiResponse.success(dtos, "Spatial query completed. Retrieved parcels residing inside Mandal administrative boundaries."));
    }

    @PostMapping("/spatial/within-geometry")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(summary = "Query Parcels Within Custom Geometry", description = "Spatial Query: Takes a raw GeoJSON Polygon in request body and returns all parcels intersecting this geometry.")
    public ResponseEntity<ApiResponse<List<ParcelDto>>> getParcelsWithinUserGeometry(@RequestBody String geojsonPolygon) {
        List<ParcelDto> dtos = parcelService.getParcelsWithinUserGeometry(geojsonPolygon);
        return ResponseEntity.ok(ApiResponse.success(dtos, "Spatial intersection query completed."));
    }
}
