type Traveler = {
  value: number;
  label: string;
};

export type BoatUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  boatCruiseLine: string;
	boatCruiseClass: string;
  departureDock: string;
  departureDate: string | Date; 
  departureTime: string;
  arrivalDock: string;
  arrivalDate: string;
  arrivalTime: string;
  cost?: string;
  notes?: string;
  attachments?: BoatAttachments[],
  travelers?: BoatTraveler[];
}

export type BoatTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  boatCruiseLine: string;
	boatCruiseClass: string;
  departureDock: string;
  departureDate: Date; 
  departureTime: Date;
  arrivalDock: string;
  arrivalDate: Date;
  arrivalTime: Date;
  cost?: string | null;
  notes?: string | null;
  attachments?: BoatAttachments[], // ONLY FOR UI
  travelers?: Traveler[]; // ONLY FOR UI
};

export type BoatTraveler = {
  id?: number;
  createdAt?: Date;
  boatId: number;
  travelerId: number;
  travelerFullName: string;
};

export type BoatAttachments = {
  id?: number | string;
  createdAt?: string;
  boatId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}