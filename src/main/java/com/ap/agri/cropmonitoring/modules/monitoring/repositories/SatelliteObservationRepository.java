package com.ap.agri.cropmonitoring.modules.monitoring.repositories;

import java.util.List;

import org.locationtech.jts.geom.Geometry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ap.agri.cropmonitoring.modules.monitoring.entities.SatelliteObservation;

@Repository
public interface SatelliteObservationRepository extends JpaRepository<SatelliteObservation, Long> {
    
    /**
     * Find all satellite observations covering a specific geometry (e.g. specific land parcel)
     */
    @Query(value = "SELECT s.* FROM satellite_observations s WHERE ST_Intersects(s.tile_boundary, :geom) = true", nativeQuery = true)
    List<SatelliteObservation> findObservationsCoveringGeometry(@Param("geom") Geometry geom);
}
