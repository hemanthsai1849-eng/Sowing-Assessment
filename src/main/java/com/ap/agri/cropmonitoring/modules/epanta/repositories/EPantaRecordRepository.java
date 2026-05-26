package com.ap.agri.cropmonitoring.modules.epanta.repositories;

import com.ap.agri.cropmonitoring.modules.epanta.entities.EPantaRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EPantaRecordRepository extends JpaRepository<EPantaRecord, Long> {
    Optional<EPantaRecord> findByParcelIdAndSeasonId(Long parcelId, Long seasonId);

    /**
     * Audit Query: Find e-Panta records in the active season where the farmer declared
     * a crop, but satellite NDVI analysis classified the parcel as 'FALLOW'.
     */
    @Query("SELECT ep FROM EPantaRecord ep " +
           "WHERE ep.season.active = true " +
           "AND ep.parcel.currentStatus = 'FALLOW'")
    List<EPantaRecord> findActiveSeasonFallowMismatches();

    /**
     * Find e-Panta records within a specific Mandal
     */
    @Query("SELECT ep FROM EPantaRecord ep WHERE ep.parcel.village.mandal.id = :mandalId")
    List<EPantaRecord> findByMandalId(@Param("mandalId") Long mandalId);
}
