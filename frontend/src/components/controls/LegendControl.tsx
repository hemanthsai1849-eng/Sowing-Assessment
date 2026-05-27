import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const LegendControl: React.FC = () => {
  const map = useMap();

  const control = L.control({ position: 'topright' });

  control.onAdd = (map) => {
    const div = L.DomUtil.create('div', 'legend-control');
    const legend = `
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <h3 class="font-bold text-sm mb-3">Legend</h3>
        
        <div>
          <p class="text-xs font-semibold mb-2">Crop Status</p>
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-crop-green rounded"></div>
              <span class="text-xs">Cropped</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-likely-yellow rounded"></div>
              <span class="text-xs">Likely Cropped</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-fallow-red rounded"></div>
              <span class="text-xs">Fallow</span>
            </div>
          </div>
        </div>

        <div>
          <p class="text-xs font-semibold mb-2">NDVI Values</p>
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-ndvi-dark rounded"></div>
              <span class="text-xs">0.7+ (Healthy)</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-crop-green rounded"></div>
              <span class="text-xs">0.5-0.7</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-likely-yellow rounded"></div>
              <span class="text-xs">0.3-0.5</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-fallow-red rounded"></div>
              <span class="text-xs">&lt;0.3</span>
            </div>
          </div>
        </div>

        <div>
          <p class="text-xs font-semibold mb-2">River Basins</p>
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-1 bg-sky-500"></div>
              <span class="text-xs">Krishna</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-1 bg-cyan-500"></div>
              <span class="text-xs">Godavari</span>
            </div>
          </div>
        </div>
      </div>
    `;
    div.innerHTML = legend;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };

  React.useEffect(() => {
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

  return null;
};

export default LegendControl;
