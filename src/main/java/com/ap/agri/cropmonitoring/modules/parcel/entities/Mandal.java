package com.ap.agri.cropmonitoring.modules.parcel.entities;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.MultiPolygon;

@Entity
@Table(name = "mandals", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"district_id", "name"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mandal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    // Hibernate Spatial mapping for Mandal MultiPolygon
    @Column(nullable = false, columnDefinition = "geometry(MultiPolygon, 4326)")
    private MultiPolygon boundary;
}
