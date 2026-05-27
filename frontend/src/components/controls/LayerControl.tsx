import React from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleLayer } from '@/store/mapSlice';
import L from 'leaflet';
import { Eye, EyeOff } from 'lucide-react';

const LayerControl: React.FC = () => {
  const map = useMap();
  const dispatch = useDispatch();
  const { activeLayers } = useSelector((state: RootState) => state.map);

  const layers = [
    { id: 'districts', label: 'District Boundaries', icon: '📍' },
    { id: 'krishna', label: 'Krishna Basin', icon: '🌊' },
    { id: 'godavari', label: 'Godavari Basin', icon: '🌊' },
    { id: 'parcels', label: 'Parcels', icon: '🌾' },
    { id: 'ndvi', label: 'NDVI Heatmap', icon: '📊' },
    { id: 'fallow', label: 'Fallow Land', icon: '⚠️' },
  ];

  const handleToggleLayer = (layerId: string) => {
    dispatch(toggleLayer(layerId));
  };

  const control = L.control({ position: 'topleft' });

  control.onAdd = (map) => {
    const div = L.DomUtil.create('div', 'layer-control');
    div.innerHTML = `
      <div class="space-y-2 max-h-96 overflow-y-auto">
        <h3 class="font-bold text-sm mb-3">Layers</h3>
        ${layers
          .map(
            (layer) => `
          <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
            <input type="checkbox" value="${layer.id}" class="layer-toggle" 
              ${activeLayers.includes(layer.id) ? 'checked' : ''} />
            <span class="text-sm">${layer.icon} ${layer.label}</span>
          </label>
        `
          )
          .join('')}
      </div>
    `;

    div.addEventListener('change', (e: any) => {
      if (e.target.classList.contains('layer-toggle')) {
        handleToggleLayer(e.target.value);
      }
    });

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

export default LayerControl;
