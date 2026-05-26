package com.ap.agri.cropmonitoring.modules.monitoring.entities;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Polygon;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "satellite_observations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SatelliteObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sensor_name", nullable = false, length = 50)
    private String sensorName; // 'SENTINEL-2', 'LANDSAT-8'

    @Column(name = "cloud_cover", nullable = false, precision = 5, scale = 2)
    private BigDecimal cloudCover;

    @Column(name = "acquisition_date", nullable = false)
    private LocalDateTime acquisitionDate;

    // Hibernate Spatial mapping for footprint/tile spatial boundary
    @Column(name = "tile_boundary", nullable = false, columnDefinition = "geometry(Polygon, 4326)")
    private Polygon tileBoundary;

    @Column(name = "file_path", length = 255)
    private String filePath;
}
