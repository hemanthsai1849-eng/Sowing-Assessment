package com.ap.agri.cropmonitoring.modules.monitoring.mappers;

import com.ap.agri.cropmonitoring.modules.monitoring.dtos.SatelliteObservationDto;
import com.ap.agri.cropmonitoring.modules.monitoring.entities.SatelliteObservation;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-27T12:44:10+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class SatelliteObservationMapperImpl extends SatelliteObservationMapper {

    @Override
    public SatelliteObservationDto toDto(SatelliteObservation entity) {
        if ( entity == null ) {
            return null;
        }

        SatelliteObservationDto.SatelliteObservationDtoBuilder satelliteObservationDto = SatelliteObservationDto.builder();

        satelliteObservationDto.id( entity.getId() );
        satelliteObservationDto.sensorName( entity.getSensorName() );
        satelliteObservationDto.cloudCover( entity.getCloudCover() );
        satelliteObservationDto.acquisitionDate( entity.getAcquisitionDate() );
        satelliteObservationDto.filePath( entity.getFilePath() );

        satelliteObservationDto.geojsonFootprint( gisSpatialUtils.toGeoJson(entity.getTileBoundary()) );

        return satelliteObservationDto.build();
    }

    @Override
    public SatelliteObservation toEntity(SatelliteObservationDto dto) {
        if ( dto == null ) {
            return null;
        }

        SatelliteObservation.SatelliteObservationBuilder satelliteObservation = SatelliteObservation.builder();

        satelliteObservation.id( dto.getId() );
        satelliteObservation.sensorName( dto.getSensorName() );
        satelliteObservation.cloudCover( dto.getCloudCover() );
        satelliteObservation.acquisitionDate( dto.getAcquisitionDate() );
        satelliteObservation.filePath( dto.getFilePath() );

        satelliteObservation.tileBoundary( (org.locationtech.jts.geom.Polygon) gisSpatialUtils.parseGeoJson(dto.getGeojsonFootprint()) );

        return satelliteObservation.build();
    }
}
