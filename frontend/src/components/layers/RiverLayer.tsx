import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { krishnaBasin, godavariBasin } from '@/data/rivers';
import L from 'leaflet';

interface RiverLayerProps {
  basin: 'KRISHNA' | 'GODAVARI';
}

const RiverLayer: React.FC<RiverLayerProps> = ({ basin }) => {
  const basinData = basin === 'KRISHNA' ? krishnaBasin : godavariBasin;
  const color = basin === 'KRISHNA' ? '#0ea5e9' : '#06b6d4';

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const popup = `
      <div class="popup-content">
        <h3 class="font-bold text-lg mb-2">${props.name || basin} Basin</h3>
        <p class="text-sm">Type: ${feature.geometry.type}</p>
      </div>
    `;
    (layer as any).bindPopup(popup);
  };

  const style = (feature: any) => {
    if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
      return {
        color,
        weight: 3,
        opacity: 0.8,
      };
    }
    return {
      fillColor: color,
      weight: 2,
      opacity: 0.8,
      color: color,
      fillOpacity: 0.1,
    };
  };

  return <GeoJSON data={basinData} style={style} onEachFeature={onEachFeature} />;
};

export default RiverLayer;
