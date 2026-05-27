package com.ap.agri.cropmonitoring.modules.monitoring.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a single NDVI data point in a time-series
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NDVIDataPoint implements Serializable {

    @JsonProperty("date")
    private LocalDate date;

    @JsonProperty("meanNdvi")
    private BigDecimal meanNdvi;

    @JsonProperty("maxNdvi")
    private BigDecimal maxNdvi;

    @JsonProperty("classification")
    private String classification; // CROPPED, LIKELY_CROPPED, FALLOW

    @JsonProperty("observationId")
    private Long observationId;

    /**
     * Get color for frontend heatmap based on NDVI value
     */
    @JsonProperty("color")
    public String getColor() {
        if (meanNdvi == null) {
            return "#CCCCCC"; // Gray for null values
        }
        double value = meanNdvi.doubleValue();
        if (value >= 0.7) return "#006400"; // Dark Green - Healthy
        if (value >= 0.5) return "#32CD32"; // Lime Green - Growing
        if (value >= 0.3) return "#FFD700"; // Gold - Stressed
        return "#FF4500";                   // Red-Orange - Poor
    }
}
