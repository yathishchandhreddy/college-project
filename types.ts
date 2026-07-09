export enum Language {
  ENGLISH = 'en',
  TAMIL = 'ta',
}

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  role: 'passenger' | 'driver' | 'admin';
  savedRoutes: string[]; // routeIds
  savedStops: string[]; // stopIds
  language: Language;
}

export interface BusStop {
  id: string;
  nameEn: string;
  nameTa: string;
  lat: number;
  lng: number;
}

export interface BusRoute {
  id: string;
  routeCode: string; // e.g. "102", "570", "21G"
  originEn: string;
  originTa: string;
  destinationEn: string;
  destinationTa: string;
  stops: BusStop[];
  color: string; // Tailwind hex or class
  type: 'ordinary' | 'deluxe' | 'air_conditioned' | 'sleeper';
  fare: number;
}

export interface BusVehicle {
  id: string;
  routeId: string;
  routeCode: string;
  vehicleNumber: string; // e.g., "TN-01-N-9876"
  lat: number;
  lng: number;
  speed: number; // km/h
  heading: number; // degrees for direction
  occupancy: 'low' | 'medium' | 'high';
  delayMinutes: number; // negative is early, positive is delayed
  nextStopId: string;
  lastUpdated: string; // ISO string
  driverName: string;
  driverPhone: string;
  status: 'running' | 'breakdown' | 'delayed' | 'scheduled';
}

export interface AlertNotification {
  id: string;
  titleEn: string;
  titleTa: string;
  messageEn: string;
  messageTa: string;
  timestamp: string;
  type: 'info' | 'warning' | 'delay' | 'success';
  routeCode?: string;
}
