package com.ap.agri.cropmonitoring.modules.parcel.repositories;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.locationtech.jts.geom.Geometry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    Optional<Parcel> findByVillageIdAndSurveyNumber(Long villageId, String surveyNumber);
    List<Parcel> findByVillageId(Long villageId);
    List<Parcel> findByCurrentStatus(String currentStatus);

    /**
     * Find all parcels residing inside a user-defined geometry polygon (e.g., specific survey boundary)
     */
    @Query(value = "SELECT p.* FROM parcels p WHERE ST_Within(p.boundary, :geom) = true", nativeQuery = true)
    List<Parcel> findParcelsWithinGeometry(@Param("geom") Geometry geom);

    /**
     * Find all parcels intersecting a geometry footprint (e.g. satellite sensor tile)
     */
    @Query(value = "SELECT p.* FROM parcels p WHERE ST_Intersects(p.boundary, :geom) = true", nativeQuery = true)
    List<Parcel> findParcelsIntersectingGeometry(@Param("geom") Geometry geom);

    /**
     * Find all parcels residing inside a Mandal administrative boundary
     */
    @Query(value = "SELECT p.* FROM parcels p WHERE ST_Within(p.boundary, (SELECT m.boundary FROM mandals m WHERE m.id = :mandalId)) = true", nativeQuery = true)
    List<Parcel> findParcelsWithinMandalBoundary(@Param("mandalId") Long mandalId);

    /**
     * Fetch Fallow parcels within a Mandal administrative boundary
     */
    @Query(value = "SELECT p.* FROM parcels p WHERE p.current_status = 'FALLOW' AND ST_Within(p.boundary, (SELECT m.boundary FROM mandals m WHERE m.id = :mandalId)) = true", nativeQuery = true)
    List<Parcel> findFallowParcelsInMandal(@Param("mandalId") Long mandalId);

    /**
     * Generate District-wide crop statistics (aggregates total count and summed area in hectares grouped by crop status)
     */
    @Query("SELECT p.currentStatus as status, COUNT(p) as parcelCount, SUM(p.areaHa) as totalArea " +
           "FROM Parcel p WHERE p.village.mandal.district.id = :districtId " +
           "GROUP BY p.currentStatus")
    List<Map<String, Object>> getDistrictCropStatistics(@Param("districtId") Long districtId);

    /**
     * Generate Mandal-wide crop statistics
     */
    @Query("SELECT p.currentStatus as status, COUNT(p) as parcelCount, SUM(p.areaHa) as totalArea " +
           "FROM Parcel p WHERE p.village.mandal.id = :mandalId " +
           "GROUP BY p.currentStatus")
    List<Map<String, Object>> getMandalCropStatistics(@Param("mandalId") Long mandalId);

    /**
     * Query all parcels within a bounding buffer of a specific coordinate point
     */
    @Query(value = "SELECT p.* FROM parcels p WHERE ST_DWithin(p.boundary, :geom, :distanceInDegrees) = true", nativeQuery = true)
    List<Parcel> findParcelsWithinBuffer(@Param("geom") Geometry geom, @Param("distanceInDegrees") double distanceInDegrees);
}
