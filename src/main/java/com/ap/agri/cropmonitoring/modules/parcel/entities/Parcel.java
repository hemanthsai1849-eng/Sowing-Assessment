package com.ap.agri.cropmonitoring.modules.parcel.entities;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Polygon;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "parcels", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"village_id", "survey_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id", nullable = false)
    private Village village;

    @Column(name = "survey_number", nullable = false, length = 50)
    private String surveyNumber;

    @Column(name = "farmer_name", nullable = false, length = 100)
    private String farmerName;

    @Column(name = "area_ha", nullable = false, precision = 10, scale = 4)
    private BigDecimal areaHa;

    // Hibernate Spatial mapping for standard parcel Polygon boundary
    @Column(nullable = false, columnDefinition = "geometry(Polygon, 4326)")
    private Polygon boundary;

    @Column(name = "current_status", nullable = false, length = 50)
    @Builder.Default
    private String currentStatus = "FALLOW"; // 'CROPPED', 'LIKELY_CROPPED', 'FALLOW'

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
