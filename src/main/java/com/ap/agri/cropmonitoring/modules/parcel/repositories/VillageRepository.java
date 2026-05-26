package com.ap.agri.cropmonitoring.modules.parcel.repositories;

import java.util.List;
import java.util.Optional;

import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ap.agri.cropmonitoring.modules.parcel.entities.Village;

@Repository
public interface VillageRepository extends JpaRepository<Village, Long> {
    Optional<Village> findByCode(String code);
    List<Village> findByMandalId(Long mandalId);

    /**
     * Find Village containing a given spatial point
     */
    @Query(value = "SELECT v.* FROM villages v WHERE ST_Contains(v.boundary, :point) = true", nativeQuery = true)
    Optional<Village> findVillageContainingPoint(@Param("point") Point point);
}
