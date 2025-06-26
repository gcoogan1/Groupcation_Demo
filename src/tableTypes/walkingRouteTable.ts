type Traveler = {
  value: number;
  label: string;
};

export type WalkingRouteUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  walkDuration: string;
  departureLocation: string;
  departureDate: string | Date; 
  departureTime: string;
  arrivalLocation: string;
  notes?: string;
  travelers?: WalkingRouteTraveler[];
}

export type WalkingRouteTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  walkDuration: string;
  departureLocation: string;
  departureDate: Date; 
  departureTime: Date;
  arrivalLocation: string;
  notes?: string | null;
  travelers?: Traveler[]; // ONLY FOR UI
};

export type WalkingRouteTraveler = {
  id?: number;
  createdAt?: Date;
  walkingRouteId: number;
  travelerId: number;
  travelerFullName: string;
};