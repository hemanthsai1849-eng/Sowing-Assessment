import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Parcel, NDVIRecord, EPantaRecord, Alert } from '@/types';

interface DataState {
  parcels: Parcel[];
  ndviRecords: NDVIRecord[];
  epantaRecords: EPantaRecord[];
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  parcels: [],
  ndviRecords: [],
  epantaRecords: [],
  alerts: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setParcels: (state, action: PayloadAction<Parcel[]>) => {
      state.parcels = action.payload;
    },
    setNDVIRecords: (state, action: PayloadAction<NDVIRecord[]>) => {
      state.ndviRecords = action.payload;
    },
    setEPantaRecords: (state, action: PayloadAction<EPantaRecord[]>) => {
      state.epantaRecords = action.payload;
    },
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setParcels, setNDVIRecords, setEPantaRecords, setAlerts, setError } =
  dataSlice.actions;
export default dataSlice.reducer;
