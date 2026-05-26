package com.ap.agri.cropmonitoring.modules.analytics.services;

import com.ap.agri.cropmonitoring.modules.parcel.repositories.DistrictRepository;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.MandalRepository;
import com.ap.agri.cropmonitoring.shared.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);

    private final com.ap.agri.cropmonitoring.modules.parcel.repositories.ParcelRepository parcelRepository;
    private final DistrictRepository districtRepository;
    private final MandalRepository mandalRepository;

    public AnalyticsService(com.ap.agri.cropmonitoring.modules.parcel.repositories.ParcelRepository parcelRepository,
                            DistrictRepository districtRepository,
                            MandalRepository mandalRepository) {
        this.parcelRepository = parcelRepository;
        this.districtRepository = districtRepository;
        this.mandalRepository = mandalRepository;
    }

    /**
     * Compile District-Wide Sowing & Fallow Land Intelligence Report
     */
    @Transactional(readOnly = true)
    public Map<String, Object> generateDistrictReport(Long districtId) {
        log.debug("Generating district-wide crop analytics for District ID: {}", districtId);

        districtRepository.findById(districtId)
                .orElseThrow(() -> new ResourceNotFoundException("District not found with ID: " + districtId));

        List<Map<String, Object>> rawStats = parcelRepository.getDistrictCropStatistics(districtId);
        return compileStatistics(rawStats, "District ID: " + districtId);
    }

    /**
     * Compile Mandal-Wide Sowing & Fallow Land Intelligence Report
     */
    @Transactional(readOnly = true)
    public Map<String, Object> generateMandalReport(Long mandalId) {
        log.debug("Generating mandal-wide crop analytics for Mandal ID: {}", mandalId);

        mandalRepository.findById(mandalId)
                .orElseThrow(() -> new ResourceNotFoundException("Mandal not found with ID: " + mandalId));

        List<Map<String, Object>> rawStats = parcelRepository.getMandalCropStatistics(mandalId);
        return compileStatistics(rawStats, "Mandal ID: " + mandalId);
    }

    /**
     * Compute totals, percentages, and summaries from raw SQL GROUP BY mappings
     */
    private Map<String, Object> compileStatistics(List<Map<String, Object>> rawStats, String scope) {
        Map<String, Object> report = new HashMap<>();
        Map<String, Object> breakdown = new HashMap<>();

        long totalParcels = 0;
        BigDecimal totalArea = BigDecimal.ZERO;

        for (Map<String, Object> stat : rawStats) {
            String status = (String) stat.get("status");
            long count = (long) stat.get("parcelCount");
            BigDecimal area = (BigDecimal) stat.get("totalArea");
            if (area == null) area = BigDecimal.ZERO;

            totalParcels += count;
            totalArea = totalArea.add(area);

            Map<String, Object> statusDetails = new HashMap<>();
            statusDetails.put("parcelCount", count);
            statusDetails.put("areaHectares", area);
            breakdown.put(status, statusDetails);
        }

        // Add percentages to breakdown details
        for (String status : breakdown.keySet()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) breakdown.get(status);
            BigDecimal area = (BigDecimal) details.get("areaHectares");

            BigDecimal pct = BigDecimal.ZERO;
            if (totalArea.compareTo(BigDecimal.ZERO) > 0) {
                pct = area.multiply(BigDecimal.valueOf(100.0)).divide(totalArea, 2, RoundingMode.HALF_UP);
            }
            details.put("percentageOfTotalArea", pct);
        }

        report.put("scope", scope);
        report.put("totalParcelsMonitored", totalParcels);
        report.put("totalMonitoredAreaHectares", totalArea);
        report.put("statusBreakdown", breakdown);

        log.info("Analytics generated for {}: Total Area Monitored: {} Hectares", scope, totalArea);
        return report;
    }
}
