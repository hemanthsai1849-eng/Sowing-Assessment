package com.ap.agri.cropmonitoring.modules.classification.services;

import com.ap.agri.cropmonitoring.modules.monitoring.entities.NDVIRecord;
import com.ap.agri.cropmonitoring.modules.monitoring.entities.SatelliteObservation;
import com.ap.agri.cropmonitoring.modules.monitoring.repositories.NDVIRecordRepository;
import com.ap.agri.cropmonitoring.modules.monitoring.repositories.SatelliteObservationRepository;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.ParcelRepository;
import com.ap.agri.cropmonitoring.shared.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CropClassificationService {

    private static final Logger log = LoggerFactory.getLogger(CropClassificationService.class);

    private final ParcelRepository parcelRepository;
    private final NDVIRecordRepository ndviRecordRepository;
    private final SatelliteObservationRepository satelliteObservationRepository;

    public CropClassificationService(ParcelRepository parcelRepository,
                                     NDVIRecordRepository ndviRecordRepository,
                                     SatelliteObservationRepository satelliteObservationRepository) {
        this.parcelRepository = parcelRepository;
        this.ndviRecordRepository = ndviRecordRepository;
        this.satelliteObservationRepository = satelliteObservationRepository;
    }

    /**
     * Core Rule Engine for NDVI Crop Classification:
     * - NDVI > 0.6: CROPPED
     * - NDVI BETWEEN 0.3 AND 0.6: LIKELY_CROPPED
     * - NDVI < 0.3: FALLOW
     */
    public String classifyByNdvi(double ndvi) {
        if (ndvi > 0.6) {
            return "CROPPED";
        } else if (ndvi >= 0.3) {
            return "LIKELY_CROPPED";
        } else {
            return "FALLOW";
        }
    }

    /**
     * Perform classification for a single parcel based on raw mean NDVI input.
     * Keeps historical audit trails in ndvi_records.
     */
    @Transactional
    public String classifyParcel(Long parcelId, double meanNdvi, Long observationId) {
        log.debug("Triggering manual classification for parcel ID: {} with NDVI: {}", parcelId, meanNdvi);

        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + parcelId));

        SatelliteObservation obs = null;
        if (observationId != null) {
            obs = satelliteObservationRepository.findById(observationId).orElse(null);
        }

        String status = classifyByNdvi(meanNdvi);

        // Update Parcel Current Status
        parcel.setCurrentStatus(status);
        parcel.setLastUpdated(LocalDateTime.now());
        parcelRepository.save(parcel);

        // Record NDVI evaluation trace
        double maxNdvi = Math.min(1.0, meanNdvi + 0.12); // Simulate max NDVI for audit logs
        NDVIRecord ndviRecord = NDVIRecord.builder()
                .parcel(parcel)
                .observation(obs)
                .meanNdvi(BigDecimal.valueOf(meanNdvi).setScale(4, RoundingMode.HALF_UP))
                .maxNdvi(BigDecimal.valueOf(maxNdvi).setScale(4, RoundingMode.HALF_UP))
                .classificationStatus(status)
                .build();

        ndviRecordRepository.save(ndviRecord);
        log.info("Parcel ID {} classified as {} based on NDVI: {}", parcelId, status, meanNdvi);
        return status;
    }

    /**
     * Batch Spatial Classification Pipeline:
     * Evaluates and classifies all cadastral parcels falling within a newly acquired satellite tile.
     */
    @Transactional
    public int classifyParcelsUnderSatelliteTile(Long observationId) {
        SatelliteObservation obs = satelliteObservationRepository.findById(observationId)
                .orElseThrow(() -> new ResourceNotFoundException("Satellite Observation not found: " + observationId));

        log.info("Starting spatial batch classification for satellite observation tile: {}", obs.getId());

        // Spatial query: Get all parcels intersecting this satellite observation tile boundary
        List<Parcel> intersectingParcels = parcelRepository.findParcelsIntersectingGeometry(obs.getTileBoundary());
        log.info("Detected {} parcels intersecting satellite tile footprint.", intersectingParcels.size());

        int processedCount = 0;
        for (Parcel parcel : intersectingParcels) {
            // In a real production setup, we would read the raw TIFF raster grids covering this parcel's polygon.
            // For this enterprise demo, we simulate a mock NDVI calculation:
            // High vegetation simulation for Rabi/Kharif seasons, mixed with fallow areas
            double mockNdvi = simulateNdviValue(parcel.getId());
            classifyParcel(parcel.getId(), mockNdvi, obs.getId());
            processedCount++;
        }

        log.info("Successfully completed batch spatial classification. Processed {} parcels.", processedCount);
        return processedCount;
    }

    /**
     * Simulate deterministic NDVI values for consistent demo behavior
     */
    private double simulateNdviValue(Long parcelId) {
        // Deterministic simulation based on parcel ID
        int mod = (int) (parcelId % 3);
        if (mod == 0) {
            return 0.78; // CROPPED
        } else if (mod == 1) {
            return 0.45; // LIKELY_CROPPED
        } else {
            return 0.15; // FALLOW
        }
    }
}
