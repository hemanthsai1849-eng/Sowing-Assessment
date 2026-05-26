package com.ap.agri.cropmonitoring.modules.monitoring.mappers;

import com.ap.agri.cropmonitoring.modules.monitoring.dtos.SatelliteObservationDto;
import com.ap.agri.cropmonitoring.modules.monitoring.entities.SatelliteObservation;
import com.ap.agri.cropmonitoring.shared.utils.GisSpatialUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class SatelliteObservationMapper {

    @Autowired
    protected GisSpatialUtils gisSpatialUtils;

    @Mapping(target = "geojsonFootprint", expression = "java(gisSpatialUtils.toGeoJson(entity.getTileBoundary()))")
    public abstract SatelliteObservationDto toDto(SatelliteObservation entity);

    @Mapping(target = "tileBoundary", expression = "java((org.locationtech.jts.geom.Polygon) gisSpatialUtils.parseGeoJson(dto.getGeojsonFootprint()))")
    public abstract SatelliteObservation toEntity(SatelliteObservationDto dto);
}
