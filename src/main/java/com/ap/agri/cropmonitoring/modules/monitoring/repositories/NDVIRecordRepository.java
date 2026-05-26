package com.ap.agri.cropmonitoring.modules.monitoring.repositories;

import com.ap.agri.cropmonitoring.modules.monitoring.entities.NDVIRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NDVIRecordRepository extends JpaRepository<NDVIRecord, Long> {
    List<NDVIRecord> findByParcelIdOrderByProcessedAtDesc(Long parcelId);

    /**
     * Get the latest NDVI record for a parcel
     */
    @Query(value = "SELECT n FROM NDVIRecord n WHERE n.parcel.id = :parcelId ORDER BY n.processedAt DESC")
    List<NDVIRecord> findLatestRecordForParcel(@Param("parcelId") Long parcelId);
}
