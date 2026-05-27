import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { districtBoundaries } from '@/data/boundaries';
import L from 'leaflet';

const DistrictLayer: React.FC = () => {
  const { selectedDistrict } = useSelector((state: RootState) => state.map);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const popup = `
      <div class="popup-content">
        <h3 class="font-bold text-lg mb-2">${props.name}</h3>
        <p class="text-sm">Mandals: ${props.mandals || 'N/A'}</p>
      </div>
    `;
    (layer as L.Popup).bindPopup(popup);
  };

  const style = (feature: any) => {
    return {
      fillColor: selectedDistrict?.id === feature.properties.id ? '#3b82f6' : '#1f2937',
      weight: selectedDistrict?.id === feature.properties.id ? 3 : 1,
      opacity: 1,
      color: '#60a5fa',
      fillOpacity: 0.1,
    };
  };

  return <GeoJSON data={districtBoundaries} style={style} onEachFeature={onEachFeature} />;
};

export default DistrictLayer;
