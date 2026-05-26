package com.ap.agri.cropmonitoring.modules.parcel.entities;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.MultiPolygon;

@Entity
@Table(name = "districts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    // Hibernate Spatial mapping for administrative boundary MultiPolygon
    @Column(nullable = false, columnDefinition = "geometry(MultiPolygon, 4326)")
    private MultiPolygon boundary;
}
