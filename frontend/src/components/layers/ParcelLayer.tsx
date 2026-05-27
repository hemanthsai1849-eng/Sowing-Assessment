import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { parcelSampleData } from '@/data/parcels';

const ParcelLayer: React.FC = () => {
  const map = useMap();
  const { selectedParcel } = useSelector((state: RootState) => state.map);

  React.useEffect(() => {
    const geoJsonLayer = L.geoJSON(
      {
        type: 'FeatureCollection',
        features: parcelSampleData.map((parcel) => ({
          type: 'Feature',
          properties: {
            id: parcel.id,
            surveyNumber: parcel.surveyNumber,
            village: parcel.villageName,
            status: parcel.currentStatus,
            ndvi: parcel.ndviValue,
            crop: parcel.cropType,
          },
          geometry: parcel.geometry.geometry,
        })),
      },
      {
        style: (feature: any) => {
          const status = feature.properties.status;
          let color = '#ef4444'; // fallow - red

          if (status === 'CROPPED') color = '#10b981'; // green
          if (status === 'LIKELY_CROPPED') color = '#eab308'; // yellow

          return {
            fillColor: color,
            weight: 1,
            opacity: 1,
            color: '#ffffff',
            fillOpacity: 0.7,
          };
        },
        onEachFeature: (feature: any, layer: L.Layer) => {
          const props = feature.properties;
          const popup = `
            <div class="popup-content max-w-xs">
              <h3 class="font-bold text-lg mb-2">Parcel ${props.id}</h3>
              <table class="text-xs w-full">
                <tr><td class="font-semibold">Survey:</td><td>${props.surveyNumber}</td></tr>
                <tr><td class="font-semibold">Village:</td><td>${props.village}</td></tr>
                <tr><td class="font-semibold">Status:</td><td class="text-crop-green">${props.status}</td></tr>
                <tr><td class="font-semibold">NDVI:</td><td>${props.ndvi?.toFixed(2) || 'N/A'}</td></tr>
                <tr><td class="font-semibold">Crop:</td><td>${props.crop || 'N/A'}</td></tr>
              </table>
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

export default ParcelLayer;
