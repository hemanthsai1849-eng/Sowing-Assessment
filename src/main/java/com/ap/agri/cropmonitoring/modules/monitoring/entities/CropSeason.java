package com.ap.agri.cropmonitoring.modules.monitoring.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "crop_seasons", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "year"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropSeason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name; // 'KHARIF', 'RABI', 'ZAID'

    @Column(nullable = false)
    private Integer year;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = false;
}
