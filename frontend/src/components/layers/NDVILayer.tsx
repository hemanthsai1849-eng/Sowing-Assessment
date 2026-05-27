import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { parcelSampleData } from '@/data/parcels';

const NDVILayer: React.FC = () => {
  const map = useMap();

  React.useEffect(() => {
    const getNDVIColor = (ndvi: number): string => {
      if (ndvi >= 0.7) return '#1e3a1f'; // dark green
      if (ndvi >= 0.5) return '#10b981'; // green
      if (ndvi >= 0.3) return '#eab308'; // yellow
      return '#ef4444'; // red
    };

    const features = parcelSampleData
      .filter((p) => p.ndviValue)
      .map((parcel) => ({
        type: 'Feature',
        properties: {
          id: parcel.id,
          ndvi: parcel.ndviValue,
          surveyNumber: parcel.surveyNumber,
        },
        geometry: parcel.geometry.geometry,
      }));

    const geoJsonLayer = L.geoJSON(
      { type: 'FeatureCollection', features },
      {
        style: (feature: any) => ({
          fillColor: getNDVIColor(feature.properties.ndvi),
          weight: 0.5,
          opacity: 1,
          color: '#ffffff',
          fillOpacity: 0.8,
        }),
        onEachFeature: (feature: any, layer: L.Layer) => {
          const props = feature.properties;
          const popup = `
            <div class="popup-content">
              <h3 class="font-bold">NDVI Analysis</h3>
              <p>Survey: ${props.surveyNumber}</p>
              <p>NDVI: ${props.ndvi?.toFixed(3)}</p>
            </div>
          `;
          (layer as any).bindPopup(popup);
        },
      }
    );

    geoJsonLayer.addTo(map);

    return () => {
      geoJsonLayer.remove();
    };
  }, [map]);

  return null;
};

export default NDVILayer;
