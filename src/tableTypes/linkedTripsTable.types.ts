type Traveler = {
  value: number;
  label: string;
};

export type LinkedTripUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  linkedTripTitle: string;
  startDate: string | Date; 
  endDate: string;
  attachments?: LinkedTripAttachments[],
  travelers?: LinkedTripTraveler[]; 
}

export type LinkedTripTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  linkedTripTitle: string;
  startDate: Date; 
  endDate: Date;
  attachments?: LinkedTripAttachments[], // ONLY FOR UI
  travelers?: Traveler[]; // ONLY FOR UI
};

export type LinkedTripTraveler = {
  id?: number;
  createdAt?: Date;
  linked_trip_id: number;
  traveler_id: number;
  traveler_full_name: string;
};

export type LinkedTripAttachments = {
  id?: number | string;
  createdAt?: string;
  linkedTripId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}