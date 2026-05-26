package com.ap.agri.cropmonitoring.modules.alerts.repositories;

import com.ap.agri.cropmonitoring.modules.alerts.entities.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByResolvedFalseOrderByCreatedAtDesc();
    List<Alert> findByParcelIdOrderByCreatedAtDesc(Long parcelId);
}
