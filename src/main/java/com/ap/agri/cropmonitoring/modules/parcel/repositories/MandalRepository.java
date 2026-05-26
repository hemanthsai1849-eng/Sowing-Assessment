package com.ap.agri.cropmonitoring.modules.parcel.repositories;

import java.util.List;
import java.util.Optional;

import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ap.agri.cropmonitoring.modules.parcel.entities.Mandal;

@Repository
public interface MandalRepository extends JpaRepository<Mandal, Long> {
    Optional<Mandal> findByCode(String code);
    List<Mandal> findByDistrictId(Long districtId);

    /**
     * Find Mandal containing a given spatial point
     */
    @Query(value = "SELECT m.* FROM mandals m WHERE ST_Contains(m.boundary, :point) = true", nativeQuery = true)
    Optional<Mandal> findMandalContainingPoint(@Param("point") Point point);
}
