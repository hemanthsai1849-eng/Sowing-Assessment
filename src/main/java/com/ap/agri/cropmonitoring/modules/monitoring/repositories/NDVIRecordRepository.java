package com.ap.agri.cropmonitoring.modules.monitoring.repositories;

import com.ap.agri.cropmonitoring.modules.monitoring.entities.NDVIRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NDVIRecordRepository extends JpaRepository<NDVIRecord, Long> {
    
    /**
     * Find all NDVI records for a parcel, ordered by date descending
     */
    List<NDVIRecord> findByParcelIdOrderByProcessedAtDesc(Long parcelId);

    /**
     * Get the latest NDVI record for a parcel
     */
    @Query(value = "SELECT n FROM NDVIRecord n WHERE n.parcel.id = :parcelId ORDER BY n.processedAt DESC")
    List<NDVIRecord> findLatestRecordForParcel(@Param("parcelId") Long parcelId);

    /**
     * Find latest NDVI records for all parcels in a district on a specific date
     * Used for heatmap generation
     */
    @Query(value = """
        SELECT DISTINCT n.* FROM ndvi_records n
        INNER JOIN parcels p ON p.id = n.parcel_id
        INNER JOIN villages v ON v.id = p.village_id
        INNER JOIN mandals m ON m.id = v.mandal_id
        WHERE m.district_id = :districtId
        AND CAST(n.processed_at AS DATE) = CAST(:filterDate AS DATE)
        ORDER BY n.processed_at DESC
    """, nativeQuery = true)
    List<NDVIRecord> findLatestNDVIByDistrictAndDate(
            @Param("districtId") Long districtId,
            @Param("filterDate") LocalDate filterDate);
}
