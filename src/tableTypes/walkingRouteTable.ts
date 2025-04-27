
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
};