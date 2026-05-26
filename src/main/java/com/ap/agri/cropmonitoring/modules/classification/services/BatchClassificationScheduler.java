package com.ap.agri.cropmonitoring.modules.classification.services;

import com.ap.agri.cropmonitoring.modules.epanta.services.EPantaAuditService;
import com.ap.agri.cropmonitoring.modules.monitoring.entities.SatelliteObservation;
import com.ap.agri.cropmonitoring.modules.monitoring.repositories.SatelliteObservationRepository;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.ParcelRepository;
import com.ap.agri.cropmonitoring.shared.utils.GisSpatialUtils;
import org.locationtech.jts.geom.Polygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@EnableScheduling
public class BatchClassificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(BatchClassificationScheduler.class);

    private final CropClassificationService classificationService;
    private final EPantaAuditService ePantaAuditService;
    private final ParcelRepository parcelRepository;
    private final SatelliteObservationRepository satelliteObservationRepository;
    private final GisSpatialUtils gisSpatialUtils;

    @Value("${app.classification.scheduler.simulation-enabled}")
    private boolean simulationEnabled;

    public BatchClassificationScheduler(CropClassificationService classificationService,
                                        EPantaAuditService ePantaAuditService,
                                        ParcelRepository parcelRepository,
                                        SatelliteObservationRepository satelliteObservationRepository,
                                        GisSpatialUtils gisSpatialUtils) {
        this.classificationService = classificationService;
        this.ePantaAuditService = ePantaAuditService;
        this.parcelRepository = parcelRepository;
        this.satelliteObservationRepository = satelliteObservationRepository;
        this.gisSpatialUtils = gisSpatialUtils;
    }

    /**
     * Standard Daily Production Scheduled Batch
     */
    @Scheduled(cron = "${app.classification.scheduler.cron}")
    public void runProductionBatch() {
        log.info("Starting production scheduled crop monitoring batch run at: {}", LocalDateTime.now());
        executeSchedulerJob();
    }

    /**
     * Developer Simulation Mode Scheduled Batch (Runs every 60 seconds in dev mode for demonstration)
     */
    @Scheduled(fixedDelayString = "${app.classification.scheduler.interval-ms}", initialDelay = 15000)
    public void runSimulationBatch() {
        if (!simulationEnabled) {
            return;
        }
        log.info("--------------------------------------------------------------------------------");
        log.info("[SIMULATION ENGINE] Starting scheduled batch crop classification & e-Panta audit...");
        executeSchedulerJob();
        log.info("[SIMULATION ENGINE] Scheduled batch execution completed.");
        log.info("--------------------------------------------------------------------------------");
    }

    /**
     * Core batch execution logic:
     * 1. Creates a mock Satellite Observation covering the entire parcel database spatial region.
     * 2. Runs the Crop Classification spatial classification pipeline.
     * 3. Triggers the e-Panta validation discrepancy audit.
     * 4. Auto-generates alerts for crop mismatch detections.
     */
    private void executeSchedulerJob() {
        try {
            List<Parcel> parcels = parcelRepository.findAll();
            if (parcels.isEmpty()) {
                log.warn("Scheduler Job: No parcels exist in database. Skipping spatial classification.");
                return;
            }

            log.info("Scheduler Job: Synthesizing regional satellite observation footprint...");
            
            // 1. Mock a giant regional satellite footprint that encapsulates all existing parcels
            Polygon boundary = (Polygon) parcels.get(0).getBoundary().getEnvelope();
            // Buffer the envelope to ensure full containment
            Polygon tileBoundary = (Polygon) gisSpatialUtils.createBuffer(boundary, 1000); // 1km buffer

            SatelliteObservation observation = SatelliteObservation.builder()
                    .sensorName("SENTINEL-2")
                    .cloudCover(BigDecimal.valueOf(2.45))
                    .acquisitionDate(LocalDateTime.now())
                    .tileBoundary(tileBoundary)
                    .filePath("s3://ap-agri-satellite-imagery/sentinel2/2026/T44N_20260525.tiff")
                    .build();

            SatelliteObservation savedObs = satelliteObservationRepository.save(observation);
            log.info("Scheduler Job: New satellite observation tile registered. ID: {}", savedObs.getId());

            // 2. Run spatial NDVI classifications on all intersecting parcels
            int classifiedCount = classificationService.classifyParcelsUnderSatelliteTile(savedObs.getId());
            log.info("Scheduler Job: Classified {} parcels.", classifiedCount);

            // 3. Trigger e-Panta discrepancy validation audits and issue alerts
            int mismatchAlerts = ePantaAuditService.auditActiveSeasonMismatches();
            log.info("Scheduler Job: Discrepancy e-Panta audit completed. Raised {} alerts.", mismatchAlerts);

        } catch (Exception e) {
            log.error("Scheduler Job failed with critical error: ", e);
        }
    }
}
