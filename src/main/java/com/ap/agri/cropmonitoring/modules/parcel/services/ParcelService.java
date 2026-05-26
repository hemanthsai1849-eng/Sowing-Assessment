package com.ap.agri.cropmonitoring.modules.parcel.services;

import com.ap.agri.cropmonitoring.modules.parcel.dtos.ParcelDto;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Village;
import com.ap.agri.cropmonitoring.modules.parcel.mappers.ParcelMapper;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.ParcelRepository;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.VillageRepository;
import com.ap.agri.cropmonitoring.shared.exception.ResourceNotFoundException;
import com.ap.agri.cropmonitoring.shared.exception.SpatialException;
import com.ap.agri.cropmonitoring.shared.utils.GisSpatialUtils;
import org.locationtech.jts.geom.Geometry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParcelService {

    private static final Logger log = LoggerFactory.getLogger(ParcelService.class);

    private final ParcelRepository parcelRepository;
    private final VillageRepository villageRepository;
    private final ParcelMapper parcelMapper;
    private final GisSpatialUtils gisSpatialUtils;

    public ParcelService(ParcelRepository parcelRepository,
                         VillageRepository villageRepository,
                         ParcelMapper parcelMapper,
                         GisSpatialUtils gisSpatialUtils) {
        this.parcelRepository = parcelRepository;
        this.villageRepository = villageRepository;
        this.parcelMapper = parcelMapper;
        this.gisSpatialUtils = gisSpatialUtils;
    }

    /**
     * Create and save a new cadastral parcel.
     * Performs spatial validation, coordinates mapping, and automatic metric area calculations.
     */
    @Transactional
    public ParcelDto createParcel(ParcelDto dto) {
        log.debug("Creating new parcel in village ID: {}, Survey No: {}", dto.getVillageId(), dto.getSurveyNumber());

        Village village = villageRepository.findById(dto.getVillageId())
                .orElseThrow(() -> new ResourceNotFoundException("Village not found with ID: " + dto.getVillageId()));

        // Check if survey number already exists in this village
        parcelRepository.findByVillageIdAndSurveyNumber(dto.getVillageId(), dto.getSurveyNumber())
                .ifPresent(p -> {
                    throw new IllegalArgumentException("Parcel with Survey Number " + dto.getSurveyNumber() + 
                            " already exists in village " + village.getName());
                });

        Parcel parcel = parcelMapper.toEntity(dto);
        parcel.setVillage(village);

        // 1. Spatial Integrity Verification: Ensure parcel boundary fits inside the parent village boundary
        if (!gisSpatialUtils.intersects(parcel.getBoundary(), village.getBoundary())) {
            throw new SpatialException("Boundary Violation: Cadastral parcel " + dto.getSurveyNumber() + 
                    " boundary must fall within parent Village " + village.getName() + " boundaries.");
        }

        // 2. High-Precision Area Calculation: Auto-calculate and override DTO area size to prevent manual manipulation
        double areaInHectares = gisSpatialUtils.calculateAreaInHectares(parcel.getBoundary());
        if (areaInHectares <= 0) {
            throw new SpatialException("Invalid Boundary Geometry: Calculated area must be greater than zero.");
        }
        parcel.setAreaHa(BigDecimal.valueOf(areaInHectares));
        
        log.info("Saving parcel Survey No: {} with auto-calculated area: {} hectares", 
                parcel.getSurveyNumber(), areaInHectares);

        Parcel savedParcel = parcelRepository.save(parcel);
        return parcelMapper.toDto(savedParcel);
    }

    @Transactional(readOnly = true)
    public ParcelDto getParcelById(Long id) {
        Parcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + id));
        return parcelMapper.toDto(parcel);
    }

    @Transactional(readOnly = true)
    public List<ParcelDto> getParcelsByVillage(Long villageId) {
        return parcelRepository.findByVillageId(villageId).stream()
                .map(parcelMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Spatial Query: Retrieve all parcels residing inside a Mandal administrative boundary
     */
    @Transactional(readOnly = true)
    public List<ParcelDto> getParcelsWithinMandal(Long mandalId) {
        log.debug("Querying parcels within Mandal ID: {}", mandalId);
        return parcelRepository.findParcelsWithinMandalBoundary(mandalId).stream()
                .map(parcelMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Spatial Query: Retrieve parcels intersecting a user-defined GeoJSON boundary polygon
     */
    @Transactional(readOnly = true)
    public List<ParcelDto> getParcelsWithinUserGeometry(String geojsonPolygon) {
        Geometry geom = gisSpatialUtils.parseGeoJson(geojsonPolygon);
        if (geom == null) {
            throw new SpatialException("Invalid spatial filter geometry");
        }
        return parcelRepository.findParcelsIntersectingGeometry(geom).stream()
                .map(parcelMapper::toDto)
                .collect(Collectors.toList());
    }
}
