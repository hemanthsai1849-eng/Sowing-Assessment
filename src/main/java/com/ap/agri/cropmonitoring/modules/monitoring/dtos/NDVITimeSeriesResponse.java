package com.ap.agri.cropmonitoring.modules.monitoring.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing NDVI time-series data for a parcel
 * Includes statistical analysis and trend information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NDVITimeSeriesResponse implements Serializable {

    @JsonProperty("parcelId")
    private Long parcelId;

    @JsonProperty("parcelName")
    private String parcelName;

    @JsonProperty("farmerName")
    private String farmerName;

    @JsonProperty("data")
    private List<NDVIDataPoint> data;

    @JsonProperty("avgNdvi")
    private BigDecimal avgNdvi;

    @JsonProperty("maxNdvi")
    private BigDecimal maxNdvi;

    @JsonProperty("minNdvi")
    private BigDecimal minNdvi;

    @JsonProperty("trendDirection")
    private String trendDirection; // UP, DOWN, STABLE

    @JsonProperty("trendPercentage")
    private BigDecimal trendPercentage;

    @JsonProperty("dataPointCount")
    private Integer dataPointCount;

    @JsonProperty("latestClassification")
    private String latestClassification;
}
