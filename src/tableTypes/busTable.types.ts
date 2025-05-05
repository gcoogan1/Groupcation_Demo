type Traveler = {
  value: number;
  label: string;
};

export type BusUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  busRoute: string;
	busClass: string;
  departureBusStop: string;
  departureDate: string | Date; 
  departureTime: string;
  arrivalBusStop: string;
  arrivalDate: string;
  arrivalTime: string;
  cost?: string;
  notes?: string;
  attachments?: BusAttachments[],
  travelers?: BusTraveler[];
}

export type BusTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  busRoute: string;
	busClass: string;
	departureBusStop: string;
	departureDate: Date;
	departureTime: Date;
	arrivalBusStop: string;
	arrivalDate: Date;
	arrivalTime: Date;
  cost?: string | null;
  notes?: string | null;
  attachments?: BusAttachments[], // ONLY FOR UI
  travelers?: Traveler[]; // ONLY FOR UI
};

export type BusTraveler = {
  id?: number;
  createdAt?: Date;
  busId: number;
  travelerId: number;
  travelerFullName: string;
};

export type BusAttachments = {
  id?: number | string;
  createdAt?: string;
  busId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}