package com.ap.agri.cropmonitoring.modules.soil.entities;

import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "soil_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoilData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal ph;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal nitrogen;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal phosphorus;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal potassium;

    @Column(name = "organic_carbon", nullable = false, precision = 5, scale = 2)
    private BigDecimal organicCarbon;

    @Column(name = "soil_type", nullable = false, length = 100)
    private String soilType; // 'Red Sandy', 'Black Cotton'

    @Column(name = "tested_at")
    private LocalDateTime testedAt;

    @PrePersist
    protected void onCreate() {
        this.testedAt = LocalDateTime.now();
    }
}
