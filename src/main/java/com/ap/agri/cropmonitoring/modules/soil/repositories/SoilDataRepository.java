package com.ap.agri.cropmonitoring.modules.soil.repositories;

import com.ap.agri.cropmonitoring.modules.soil.entities.SoilData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SoilDataRepository extends JpaRepository<SoilData, Long> {
    List<SoilData> findByParcelIdOrderByTestedAtDesc(Long parcelId);
    Optional<SoilData> findFirstByParcelIdOrderByTestedAtDesc(Long parcelId);
}
