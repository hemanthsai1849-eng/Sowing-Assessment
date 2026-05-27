import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapState, Parcel, District } from '@/types';

const initialState: MapState = {
  center: [16.5062, 80.6437],
  zoom: 7,
  activeLayers: ['districts', 'krishna', 'godavari', 'parcels'],
  selectedParcel: null,
  selectedDistrict: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    toggleLayer: (state, action: PayloadAction<string>) => {
      const layer = action.payload;
      const index = state.activeLayers.indexOf(layer);
      if (index > -1) {
        state.activeLayers.splice(index, 1);
      } else {
        state.activeLayers.push(layer);
      }
    },
    setActiveLayers: (state, action: PayloadAction<string[]>) => {
      state.activeLayers = action.payload;
    },
    selectParcel: (state, action: PayloadAction<Parcel | null>) => {
      state.selectedParcel = action.payload;
    },
    selectDistrict: (state, action: PayloadAction<District | null>) => {
      state.selectedDistrict = action.payload;
    },
  },
});

export const { setCenter, setZoom, toggleLayer, setActiveLayers, selectParcel, selectDistrict } =
  mapSlice.actions;
export default mapSlice.reducer;
