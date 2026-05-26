package com.ap.agri.cropmonitoring.modules.monitoring.entities;

import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ndvi_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NDVIRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "observation_id")
    private SatelliteObservation observation;

    @Column(name = "mean_ndvi", nullable = false, precision = 5, scale = 4)
    private BigDecimal meanNdvi;

    @Column(name = "max_ndvi", nullable = false, precision = 5, scale = 4)
    private BigDecimal maxNdvi;

    @Column(name = "classification_status", nullable = false, length = 50)
    private String classificationStatus; // 'CROPPED', 'LIKELY_CROPPED', 'FALLOW'

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        this.processedAt = LocalDateTime.now();
    }
}
