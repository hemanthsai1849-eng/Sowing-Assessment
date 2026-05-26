package com.ap.agri.cropmonitoring.modules.parcel.repositories;

import java.util.Optional;

import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ap.agri.cropmonitoring.modules.parcel.entities.District;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    Optional<District> findByCode(String code);
    Optional<District> findByName(String name);

    /**
     * Find District containing a given spatial point
     */
    @Query(value = "SELECT d.* FROM districts d WHERE ST_Contains(d.boundary, :point) = true", nativeQuery = true)
    Optional<District> findDistrictContainingPoint(@Param("point") Point point);
}
