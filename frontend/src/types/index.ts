export interface Parcel {
  id: number;
  surveyNumber: string;
  villageId: number;
  villageName: string;
  districtName: string;
  mandalName: string;
  areaHa: number;
  currentStatus: 'CROPPED' | 'LIKELY_CROPPED' | 'FALLOW' | 'UNKNOWN';
  waterSourceId: number;
  basinType: 'KRISHNA' | 'GODAVARI' | 'OTHER';
  geometry: GeoJSON.Feature;
  ndviValue?: number;
  cropType?: string;
  seasonId?: number;
}

export interface NDVIRecord {
  id: number;
  parcelId: number;
  ndviValue: number;
  recordDate: string;
  classification: 'CROPPED' | 'LIKELY_CROPPED' | 'FALLOW';
}

export interface EPantaRecord {
  id: number;
  parcelId: number;
  farmerName: string;
  cropName: string;
  sownAreaHa: number;
  registrationDate: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export interface Alert {
  id: number;
  parcelId: number;
  alertType: 'MISMATCH_FOUND' | 'CRITICAL_FALLOW' | 'WEATHER_ANOMALY';
  message: string;
  createdAt: string;
  resolved: boolean;
}

export interface District {
  id: number;
  name: string;
  geometry: GeoJSON.Feature;
  mandals: Mandal[];
}

export interface Mandal {
  id: number;
  name: string;
  districtId: number;
  geometry: GeoJSON.Feature;
  villages: Village[];
}

export interface Village {
  id: number;
  name: string;
  mandalId: number;
  geometry: GeoJSON.Feature;
  parcels: Parcel[];
}

export interface RiverBasin {
  id: number;
  name: 'KRISHNA' | 'GODAVARI';
  geometry: GeoJSON.Feature;
  tributaries: GeoJSON.Feature[];
  irrigationCommand?: GeoJSON.Feature;
}

export interface Analytics {
  totalParcels: number;
  croppedArea: number;
  fallowArea: number;
  averageNDVI: number;
  basinWiseIrrigation: Record<string, number>;
  epantaMatchPercentage: number;
  topCrops: Array<{ cropName: string; count: number }>;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  activeLayers: string[];
  selectedParcel: Parcel | null;
  selectedDistrict: District | null;
}
