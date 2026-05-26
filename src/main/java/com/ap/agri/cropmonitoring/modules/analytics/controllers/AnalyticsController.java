package com.ap.agri.cropmonitoring.modules.analytics.controllers;

import com.ap.agri.cropmonitoring.modules.analytics.services.AnalyticsService;
import com.ap.agri.cropmonitoring.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Analytics & Reports Service", description = "Aggregated crop sowing indicators, fallow ratios, and regional dashboard reports.")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/district/{districtId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(summary = "District Intelligence Dashboard", description = "Compiles total monitored hectares, total parcel counts, and sowing percentages grouped by status across a District.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDistrictAnalytics(@PathVariable Long districtId) {
        Map<String, Object> report = analyticsService.generateDistrictReport(districtId);
        return ResponseEntity.ok(ApiResponse.success(report, "District-wide agricultural report generated."));
    }

    @GetMapping("/mandal/{mandalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(summary = "Mandal Intelligence Dashboard", description = "Compiles sowing percentages, total monitored hectares, and status counts across a Mandal sub-district.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMandalAnalytics(@PathVariable Long mandalId) {
        Map<String, Object> report = analyticsService.generateMandalReport(mandalId);
        return ResponseEntity.ok(ApiResponse.success(report, "Mandal-wide agricultural report generated."));
    }
}
