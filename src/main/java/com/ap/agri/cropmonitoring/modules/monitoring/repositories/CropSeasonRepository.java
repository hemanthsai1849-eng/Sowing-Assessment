package com.ap.agri.cropmonitoring.modules.monitoring.repositories;

import com.ap.agri.cropmonitoring.modules.monitoring.entities.CropSeason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CropSeasonRepository extends JpaRepository<CropSeason, Long> {
    Optional<CropSeason> findByActiveTrue();
    Optional<CropSeason> findByNameAndYear(String name, Integer year);
}
