package com.ap.agri.cropmonitoring.modules.epanta.services;

import com.ap.agri.cropmonitoring.modules.alerts.entities.Alert;
import com.ap.agri.cropmonitoring.modules.alerts.repositories.AlertRepository;
import com.ap.agri.cropmonitoring.modules.epanta.entities.EPantaRecord;
import com.ap.agri.cropmonitoring.modules.epanta.repositories.EPantaRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EPantaAuditService {

    private static final Logger log = LoggerFactory.getLogger(EPantaAuditService.class);

    private final EPantaRecordRepository ePantaRecordRepository;
    private final AlertRepository alertRepository;

    public EPantaAuditService(EPantaRecordRepository ePantaRecordRepository,
                              AlertRepository alertRepository) {
        this.ePantaRecordRepository = ePantaRecordRepository;
        this.alertRepository = alertRepository;
    }

    /**
     * Audit Engine: Query all e-Panta records in the active season.
     * Compares declared agricultural crop values against direct spatial NDVI classification.
     * Raises high-priority alerts when fields are physically 'FALLOW' but registered as cultivated.
     */
    @Transactional
    public int auditActiveSeasonMismatches() {
        log.info("Auditing active season e-Panta declarations against physical crop status...");

        // Query custom JPQL: Fetch registered crop sowing where physical state is FALLOW
        List<EPantaRecord> mismatches = ePantaRecordRepository.findActiveSeasonFallowMismatches();
        log.info("Detected {} potential e-Panta anomalies.", mismatches.size());

        int alertCount = 0;
        for (EPantaRecord record : mismatches) {
            boolean alreadyAlerted = alertRepository.findByParcelIdOrderByCreatedAtDesc(record.getParcel().getId()).stream()
                    .anyMatch(a -> !a.isResolved() && "MISMATCH_FOUND".equals(a.getAlertType()));

            if (alreadyAlerted) {
                log.debug("Active mismatch alert already exists for Parcel ID: {}. Skipping duplicate.", record.getParcel().getId());
                continue;
            }

            // Create high-priority inspection alert
            String message = String.format(
                    "DISCREPANCY DETECTED: Survey No %s in Village %s is classified as [FALLOW] via satellite NDVI analysis, " +
                    "but official e-Panta database lists Farmer %s cultivating [%s] (%s Hectares). Field inspection required.",
                    record.getParcel().getSurveyNumber(),
                    record.getParcel().getVillage().getName(),
                    record.getFarmerName(),
                    record.getCropName(),
                    record.getSownAreaHa()
            );

            Alert alert = Alert.builder()
                    .parcel(record.getParcel())
                    .season(record.getSeason())
                    .alertType("MISMATCH_FOUND")
                    .message(message)
                    .resolved(false)
                    .build();

            alertRepository.save(alert);
            log.warn("RAISED ALERT: Parcel ID {} survey {} has failed e-Panta spatial verification.", 
                    record.getParcel().getId(), record.getParcel().getSurveyNumber());
            alertCount++;
        }

        return alertCount;
    }

    /**
     * Compare specific parcel e-Panta record vs current satellite classification
     */
    @Transactional(readOnly = true)
    public String compareEPantaRecord(Long parcelId, Long seasonId) {
        EPantaRecord record = ePantaRecordRepository.findByParcelIdAndSeasonId(parcelId, seasonId)
                .orElse(null);

        if (record == null) {
            return "NO_RECORD";
        }

        String physicalStatus = record.getParcel().getCurrentStatus();
        if ("FALLOW".equals(physicalStatus)) {
            return "MISMATCH_FALLOW"; // Physically fallow, but registered
        } else if ("CROPPED".equals(physicalStatus) || "LIKELY_CROPPED".equals(physicalStatus)) {
            return "VERIFIED"; // Matches cultivation claim
        }

        return "PENDING";
    }
}
