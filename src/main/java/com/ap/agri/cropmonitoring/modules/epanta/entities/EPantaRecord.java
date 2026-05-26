package com.ap.agri.cropmonitoring.modules.epanta.entities;

import com.ap.agri.cropmonitoring.modules.monitoring.entities.CropSeason;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "e_panta_records", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"parcel_id", "season_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EPantaRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private CropSeason season;

    @Column(name = "farmer_name", nullable = false, length = 100)
    private String farmerName;

    @Column(name = "crop_name", nullable = false, length = 100)
    private String cropName;

    @Column(name = "sown_area_ha", nullable = false, precision = 10, scale = 4)
    private BigDecimal sownAreaHa;

    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    @Column(name = "verification_status", nullable = false, length = 50)
    private String verificationStatus; // 'VERIFIED', 'PENDING', 'REJECTED'
}
