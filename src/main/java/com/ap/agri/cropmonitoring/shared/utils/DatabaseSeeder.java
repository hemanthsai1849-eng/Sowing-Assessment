package com.ap.agri.cropmonitoring.shared.utils;

import com.ap.agri.cropmonitoring.modules.epanta.entities.EPantaRecord;
import com.ap.agri.cropmonitoring.modules.epanta.repositories.EPantaRecordRepository;
import com.ap.agri.cropmonitoring.modules.monitoring.entities.CropSeason;
import com.ap.agri.cropmonitoring.modules.monitoring.repositories.CropSeasonRepository;
import com.ap.agri.cropmonitoring.modules.parcel.entities.District;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Mandal;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Village;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.DistrictRepository;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.MandalRepository;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.VillageRepository;
import org.locationtech.jts.geom.MultiPolygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Enterprise Automatic Database Seeder
 * Automatically populates administrative boundaries (District, Mandal, Village) 
 * and e-Panta crop records on application startup to ensure instant local testing compatibility.
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final DistrictRepository districtRepository;
    private final MandalRepository mandalRepository;
    private final VillageRepository villageRepository;
    private final CropSeasonRepository cropSeasonRepository;
    private final EPantaRecordRepository ePantaRecordRepository;
    private final GisSpatialUtils gisSpatialUtils;

    public DatabaseSeeder(DistrictRepository districtRepository,
                          MandalRepository mandalRepository,
                          VillageRepository villageRepository,
                          CropSeasonRepository cropSeasonRepository,
                          EPantaRecordRepository ePantaRecordRepository,
                          GisSpatialUtils gisSpatialUtils) {
        this.districtRepository = districtRepository;
        this.mandalRepository = mandalRepository;
        this.villageRepository = villageRepository;
        this.cropSeasonRepository = cropSeasonRepository;
        this.ePantaRecordRepository = ePantaRecordRepository;
        this.gisSpatialUtils = gisSpatialUtils;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (districtRepository.count() > 0) {
            log.info("Database Seeder: Administrative boundaries already seeded. Skipping seeder.");
            return;
        }

        log.info("--------------------------------------------------------------------------------");
        log.info("[DATABASE SEEDER] Seeding NTR District administrative structures & spatial boundaries...");

        try {
            // 1. Seed NTR District boundary
            District NTR = District.builder()
                    .id(1L)
                    .name("NTR District")
                    .code("AP_NTR")
                    .boundary((MultiPolygon) gisSpatialUtils.parseWkt(
                            "MULTIPOLYGON(((80.5 16.4, 80.8 16.4, 80.8 16.7, 80.5 16.7, 80.5 16.4)))"))
                    .build();
            District savedNTR = districtRepository.save(NTR);
            log.info("Seeded District: {}", savedNTR.getName());

            // 2. Seed Kanchikacherla Mandal boundary
            Mandal kanchiMandal = Mandal.builder()
                    .id(1L)
                    .district(savedNTR)
                    .name("Kanchikacherla")
                    .code("AP_NTR_KANCHI")
                    .boundary((MultiPolygon) gisSpatialUtils.parseWkt(
                            "MULTIPOLYGON(((80.6 16.5, 80.7 16.5, 80.7 16.6, 80.6 16.6, 80.6 16.5)))"))
                    .build();
            Mandal savedMandal = mandalRepository.save(kanchiMandal);
            log.info("Seeded Mandal: {}", savedMandal.getName());

            // 3. Seed Kanchikacherla Village boundary
            Village kanchiVillage = Village.builder()
                    .id(1L)
                    .mandal(savedMandal)
                    .name("Kanchikacherla Village")
                    .code("AP_NTR_KANCHI_VIL")
                    .boundary((MultiPolygon) gisSpatialUtils.parseWkt(
                            "MULTIPOLYGON(((80.61 16.52, 80.65 16.52, 80.65 16.56, 80.61 16.56, 80.61 16.52)))"))
                    .build();
            Village savedVillage = villageRepository.save(kanchiVillage);
            log.info("Seeded Village: {}", savedVillage.getName());

            log.info("[DATABASE SEEDER] Seeding completed successfully. Ready for instant REST testing!");
            log.info("--------------------------------------------------------------------------------");

        } catch (Exception e) {
            log.error("[DATABASE SEEDER] Seeding failed with error: ", e);
        }
    }
}
