type Traveler = {
  value: number;
  label: string;
};

export type TrainUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  railwayLine: string;
  class: string;
  departureStation: string;
  departureDate: string | Date; 
  departureTime: string;
  arrivalStation: string;
  arrivalDate: string;
  arrivalTime: string;
  cost?: string;
  notes?: string;
  attachments?: TrainAttachments[],
  travelers?: TrainTraveler[];
}

export type TrainTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  railwayLine: string;
  class: string;
  departureStation: string;
  departureDate: Date; 
  departureTime: Date;
  arrivalStation: string;
  arrivalDate: Date;
  arrivalTime: Date;
  cost?: string | null;
  notes?: string | null;
  attachments?: TrainAttachments[], // ONLY FOR UI
  travelers?: Traveler[]; // ONLY FOR UI
};

export type TrainTraveler = {
  // value: any;
  // label: any;
  id?: number;
  createdAt?: Date;
  trainId: number;
  travelerId: number;
  travelerFullName: string;
};

export type TrainAttachments = {
  id?: number | string;
  createdAt?: string;
  trainId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}