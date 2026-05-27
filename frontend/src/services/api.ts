import axios from 'axios';
import { Parcel, NDVIRecord, EPantaRecord, Alert, Analytics, RiverBasin } from '@/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Parcels API
export const parcelService = {
  getAll: () => apiClient.get<Parcel[]>('/parcels'),
  getById: (id: number) => apiClient.get<Parcel>(`/parcels/${id}`),
  getFallow: () => apiClient.get<Parcel[]>('/parcels/fallow'),
  getByVillage: (villageId: number) => apiClient.get<Parcel[]>(`/parcels/village/${villageId}`),
  getByDistrict: (districtId: number) => apiClient.get<Parcel[]>(`/parcels/district/${districtId}`),
};

// NDVI Records API
export const ndviService = {
  getCurrent: () => apiClient.get<NDVIRecord[]>('/ndvi/current'),
  getByParcel: (parcelId: number) => apiClient.get<NDVIRecord[]>(`/ndvi/parcel/${parcelId}`),
  getTimeSeries: (parcelId: number, startDate: string, endDate: string) =>
    apiClient.get<NDVIRecord[]>(`/ndvi/timeseries/${parcelId}`, { params: { startDate, endDate } }),
};

// e-Panta Records API
export const epantaService = {
  getAll: () => apiClient.get<EPantaRecord[]>('/epanta'),
  getByParcel: (parcelId: number) => apiClient.get<EPantaRecord>(`/epanta/parcel/${parcelId}`),
  compareWithNDVI: (parcelId: number, seasonId: number) =>
    apiClient.get(`/epanta/compare/${parcelId}/${seasonId}`),
};

// Alerts API
export const alertService = {
  getAll: () => apiClient.get<Alert[]>('/alerts'),
  getByParcel: (parcelId: number) => apiClient.get<Alert[]>(`/alerts/parcel/${parcelId}`),
  getUnresolved: () => apiClient.get<Alert[]>('/alerts/unresolved'),
};

// Analytics API
export const analyticsService = {
  getOverall: () => apiClient.get<Analytics>('/analytics/overall'),
  getByDistrict: (districtId: number) => apiClient.get<Analytics>(`/analytics/district/${districtId}`),
  getByMandal: (mandalId: number) => apiClient.get<Analytics>(`/analytics/mandal/${mandalId}`),
};

// River Basins API
export const riverService = {
  getKrishnaBasin: () => apiClient.get<RiverBasin>('/basins/krishna'),
  getGodavariBasin: () => apiClient.get<RiverBasin>('/basins/godavari'),
  getAll: () => apiClient.get<RiverBasin[]>('/basins'),
};

export default apiClient;
