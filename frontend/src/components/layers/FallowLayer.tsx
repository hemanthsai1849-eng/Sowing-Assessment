import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { parcelSampleData } from '@/data/parcels';

const FallowLayer: React.FC = () => {
  const map = useMap();

  React.useEffect(() => {
    const fallowParcels = parcelSampleData
      .filter((p) => p.currentStatus === 'FALLOW')
      .map((parcel) => ({
        type: 'Feature',
        properties: {
          id: parcel.id,
          surveyNumber: parcel.surveyNumber,
          village: parcel.villageName,
        },
        geometry: parcel.geometry.geometry,
      }));

    const geoJsonLayer = L.geoJSON(
      { type: 'FeatureCollection', features: fallowParcels },
      {
        style: {
          fillColor: '#ef4444',
          weight: 2,
          opacity: 1,
          color: '#dc2626',
          fillOpacity: 0.5,
          dashArray: '5, 5',
        },
        onEachFeature: (feature: any, layer: L.Layer) => {
          const props = feature.properties;
          const popup = `
            <div class="popup-content">
              <h3 class="font-bold text-lg mb-2">Fallow Land Alert</h3>
              <p><strong>Survey:</strong> ${props.surveyNumber}</p>
              <p><strong>Village:</strong> ${props.village}</p>
              <p class="text-fallow-red mt-2">Status: FALLOW</p>
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

export default FallowLayer;
