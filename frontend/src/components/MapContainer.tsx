import React, { useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setZoom } from '@/store/mapSlice';
import ParcelLayer from './layers/ParcelLayer';
import RiverLayer from './layers/RiverLayer';
import NDVILayer from './layers/NDVILayer';
import FallowLayer from './layers/FallowLayer';
import DistrictLayer from './layers/DistrictLayer';
import LayerControl from './controls/LayerControl';
import LegendControl from './controls/LegendControl';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  className?: string;
}

const MapContainer: React.FC<MapContainerProps> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const { center, zoom, activeLayers } = useSelector((state: RootState) => state.map);

  const handleZoomChange = (e: any) => {
    dispatch(setZoom(e.target._zoom));
  };

  return (
    <div className={`relative h-full w-full ${className}`}>
      <LeafletMapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="map-container"
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
      >
        {/* Base Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* Administrative Boundaries */}
        {activeLayers.includes('districts') && <DistrictLayer />}

        {/* River Basins */}
        {activeLayers.includes('krishna') && <RiverLayer basin="KRISHNA" />}
        {activeLayers.includes('godavari') && <RiverLayer basin="GODAVARI" />}

        {/* Spatial Data Layers */}
        {activeLayers.includes('parcels') && <ParcelLayer />}
        {activeLayers.includes('ndvi') && <NDVILayer />}
        {activeLayers.includes('fallow') && <FallowLayer />}

        {/* Controls */}
        <ZoomControl position="bottomright" />
        <LayerControl />
        <LegendControl />
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainer;
