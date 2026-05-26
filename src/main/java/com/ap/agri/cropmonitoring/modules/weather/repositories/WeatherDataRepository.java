package com.ap.agri.cropmonitoring.modules.weather.repositories;

import com.ap.agri.cropmonitoring.modules.weather.entities.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    Optional<WeatherData> findByVillageIdAndRecordDate(Long villageId, LocalDate recordDate);
    List<WeatherData> findByVillageIdAndRecordDateBetween(Long villageId, LocalDate start, LocalDate end);
}
