package com.ap.agri.cropmonitoring.modules.epanta.controllers;

import com.ap.agri.cropmonitoring.modules.alerts.entities.Alert;
import com.ap.agri.cropmonitoring.modules.alerts.repositories.AlertRepository;
import com.ap.agri.cropmonitoring.modules.epanta.entities.EPantaRecord;
import com.ap.agri.cropmonitoring.modules.epanta.repositories.EPantaRecordRepository;
import com.ap.agri.cropmonitoring.modules.epanta.services.EPantaAuditService;
import com.ap.agri.cropmonitoring.shared.dto.ApiResponse;
import com.ap.agri.cropmonitoring.shared.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/epanta")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "e-Panta Validation Service", description = "Audits comparing physical crop states with administrative records, tracking sowing discrepancy alerts.")
public class EPantaValidationController {

    private final EPantaAuditService ePantaAuditService;
    private final EPantaRecordRepository ePantaRecordRepository;
    private final AlertRepository alertRepository;

    public EPantaValidationController(EPantaAuditService ePantaAuditService,
                                      EPantaRecordRepository ePantaRecordRepository,
                                      AlertRepository alertRepository) {
        this.ePantaAuditService = ePantaAuditService;
        this.ePantaRecordRepository = ePantaRecordRepository;
        this.alertRepository = alertRepository;
    }

    @PostMapping("/audit")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Trigger Sowing Validation Audit", description = "Executes the discrepancy audit, comparing satellite NDVI statuses with e-Panta entries and raising Alerts. Restricted to Admin/Officer.")
    public ResponseEntity<ApiResponse<Integer>> triggerAudit() {
        int raisedAlerts = ePantaAuditService.auditActiveSeasonMismatches();
        return ResponseEntity.ok(ApiResponse.success(raisedAlerts, 
                "e-Panta audit successfully completed. Raised " + raisedAlerts + " new anomaly alerts."));
    }

    @GetMapping("/mismatches")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(summary = "Fetch e-Panta Sowing Mismatches", description = "Retrieves active season e-Panta records where physical satellite classification shows FALLOW.")
    public ResponseEntity<ApiResponse<List<EPantaRecord>>> getMismatches() {
        List<EPantaRecord> records = ePantaRecordRepository.findActiveSeasonFallowMismatches();
        return ResponseEntity.ok(ApiResponse.success(records, "Retrieved e-Panta crop sowing anomalies."));
    }

    @GetMapping("/alerts")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER', 'ANALYST')")
    @Operation(summary = "List Active Discrepancy Alerts", description = "Returns all unresolved crop sowing verification anomalies for field investigation.")
    public ResponseEntity<ApiResponse<List<Alert>>> getActiveAlerts() {
        List<Alert> alerts = alertRepository.findByResolvedFalseOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.success(alerts, "Unresolved alerts list fetched."));
    }

    @PostMapping("/alerts/{alertId}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Mark Alert as Resolved", description = "Updates an alert as resolved after a physical field inspection confirms status. Restricted to Admin/Officer.")
    public ResponseEntity<ApiResponse<Alert>> resolveAlert(@PathVariable Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with ID: " + alertId));

        alert.setResolved(true);
        alert.setResolvedAt(LocalDateTime.now());
        Alert savedAlert = alertRepository.save(alert);

        return ResponseEntity.ok(ApiResponse.success(savedAlert, "Alert marked as resolved."));
    }

    @PostMapping("/records")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    @Operation(summary = "Create e-Panta Record", description = "Registers a new official e-Panta crop registration claim for a parcel. Restricted to Admin/Officer.")
    public ResponseEntity<ApiResponse<EPantaRecord>> createEPantaRecord(
            @RequestParam Long parcelId,
            @RequestParam Long seasonId,
            @RequestParam String farmerName,
            @RequestParam String cropName,
            @RequestParam double sownAreaHa) {
        
        com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel parcel = 
                com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel.builder().id(parcelId).build();
        
        com.ap.agri.cropmonitoring.modules.monitoring.entities.CropSeason season = 
                com.ap.agri.cropmonitoring.modules.monitoring.entities.CropSeason.builder().id(seasonId).build();
        
        EPantaRecord record = EPantaRecord.builder()
                .parcel(parcel)
                .season(season)
                .farmerName(farmerName)
                .cropName(cropName)
                .sownAreaHa(java.math.BigDecimal.valueOf(sownAreaHa))
                .registrationDate(java.time.LocalDate.now())
                .verificationStatus("VERIFIED")
                .build();
        
        EPantaRecord saved = ePantaRecordRepository.save(record);
        return ResponseEntity.ok(ApiResponse.success(saved, "e-Panta record registered successfully."));
    }
}
