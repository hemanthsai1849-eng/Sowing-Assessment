package com.ap.agri.cropmonitoring.modules.monitoring.dtos;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SatelliteObservationDto {

    private Long id;

    @NotBlank(message = "Sensor name is required (e.g. SENTINEL-2)")
    private String sensorName;

    @NotNull(message = "Cloud cover percentage is required")
    @DecimalMin(value = "0.0", message = "Cloud cover cannot be less than 0%")
    @DecimalMax(value = "100.0", message = "Cloud cover cannot be more than 100%")
    private BigDecimal cloudCover;

    @NotNull(message = "Acquisition date and time is required")
    private LocalDateTime acquisitionDate;

    @NotBlank(message = "Tile footprint boundary in GeoJSON format is required")
    private String geojsonFootprint; // Footprint of the satellite tile

    private String filePath;
}
