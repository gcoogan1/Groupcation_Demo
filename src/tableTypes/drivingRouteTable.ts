type Traveler = {
  value: number;
  label: string;
};

export type DrivingRouteUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  driveDuration: string;
  departureLocation: string;
  departureDate: string | Date; 
  departureTime: string;
  arrivalLocation: string;
  arrivalDate?: string | Date;
  notes?: string;
  travelers?: DrivingTraveler[];
}

export type DrivingRouteTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  driveDuration: string;
  departureLocation: string;
  departureDate: Date; 
  departureTime: Date;
  arrivalLocation: string;
  arrivalDate?: Date | string;
  notes?: string | null;
  travelers?: Traveler[]; // ONLY FOR UI
};

export type DrivingTraveler = {
  id?: number;
  createdAt?: Date;
  drivingId: number;
  travelerId: number;
  travelerFullName: string;
};