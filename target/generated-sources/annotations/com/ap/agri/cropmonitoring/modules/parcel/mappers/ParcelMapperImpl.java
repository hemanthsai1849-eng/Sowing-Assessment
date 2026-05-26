package com.ap.agri.cropmonitoring.modules.parcel.mappers;

import com.ap.agri.cropmonitoring.modules.parcel.dtos.ParcelDto;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Village;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-26T22:52:10+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class ParcelMapperImpl extends ParcelMapper {

    @Override
    public ParcelDto toDto(Parcel entity) {
        if ( entity == null ) {
            return null;
        }

        ParcelDto.ParcelDtoBuilder parcelDto = ParcelDto.builder();

        parcelDto.villageId( entityVillageId( entity ) );
        parcelDto.villageName( entityVillageName( entity ) );
        parcelDto.id( entity.getId() );
        parcelDto.surveyNumber( entity.getSurveyNumber() );
        parcelDto.farmerName( entity.getFarmerName() );
        parcelDto.areaHa( entity.getAreaHa() );
        parcelDto.currentStatus( entity.getCurrentStatus() );
        parcelDto.lastUpdated( entity.getLastUpdated() );

        parcelDto.geojsonGeometry( gisSpatialUtils.toGeoJson(entity.getBoundary()) );

        return parcelDto.build();
    }

    @Override
    public Parcel toEntity(ParcelDto dto) {
        if ( dto == null ) {
            return null;
        }

        Parcel.ParcelBuilder parcel = Parcel.builder();

        parcel.id( dto.getId() );
        parcel.surveyNumber( dto.getSurveyNumber() );
        parcel.farmerName( dto.getFarmerName() );
        parcel.areaHa( dto.getAreaHa() );
        parcel.currentStatus( dto.getCurrentStatus() );

        parcel.boundary( (org.locationtech.jts.geom.Polygon) gisSpatialUtils.parseGeoJson(dto.getGeojsonGeometry()) );

        return parcel.build();
    }

    private Long entityVillageId(Parcel parcel) {
        if ( parcel == null ) {
            return null;
        }
        Village village = parcel.getVillage();
        if ( village == null ) {
            return null;
        }
        Long id = village.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entityVillageName(Parcel parcel) {
        if ( parcel == null ) {
            return null;
        }
        Village village = parcel.getVillage();
        if ( village == null ) {
            return null;
        }
        String name = village.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
