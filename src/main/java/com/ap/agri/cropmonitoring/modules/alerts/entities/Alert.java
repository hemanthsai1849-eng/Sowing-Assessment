package com.ap.agri.cropmonitoring.modules.alerts.entities;

import com.ap.agri.cropmonitoring.modules.monitoring.entities.CropSeason;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private CropSeason season;

    @Column(name = "alert_type", nullable = false, length = 50)
    private String alertType; // 'MISMATCH_FOUND', 'CRITICAL_FALLOW', 'WEATHER_ANOMALY'

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean resolved = false;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
