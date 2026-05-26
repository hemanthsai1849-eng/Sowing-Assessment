package com.ap.agri.cropmonitoring.modules.parcel.mappers;

import com.ap.agri.cropmonitoring.modules.parcel.dtos.ParcelDto;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import com.ap.agri.cropmonitoring.shared.utils.GisSpatialUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ParcelMapper {

    @Autowired
    protected GisSpatialUtils gisSpatialUtils;

    @Mapping(target = "geojsonGeometry", expression = "java(gisSpatialUtils.toGeoJson(entity.getBoundary()))")
    @Mapping(target = "villageId", source = "village.id")
    @Mapping(target = "villageName", source = "village.name")
    public abstract ParcelDto toDto(Parcel entity);

    @Mapping(target = "boundary", expression = "java((org.locationtech.jts.geom.Polygon) gisSpatialUtils.parseGeoJson(dto.getGeojsonGeometry()))")
    @Mapping(target = "village", ignore = true)
    @Mapping(target = "lastUpdated", ignore = true)
    public abstract Parcel toEntity(ParcelDto dto);
}
