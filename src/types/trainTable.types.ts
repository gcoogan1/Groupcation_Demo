

export type TrainTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  railwayLine: string;
  class?: string;
  departureStation: string;
  departureDate: Date; 
  departureTime: Date;
  arrivalStation: string;
  arrivalDate: Date;
  arrivalTime: Date;
  cost?: string | null;
  notes?: string | null;
  attachments?: TrainAttachments[]
};

export type TrainTraveler = {
  id?: number;
  createdAt?: Date;
  train_id: number;
  traveler_id: number;
  traveler_full_name: string;
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