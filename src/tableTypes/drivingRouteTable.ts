
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
};