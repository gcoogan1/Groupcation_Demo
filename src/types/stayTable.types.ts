

export type StayTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
	placeName: string;
	placeAddress: string;
	checkInDate: Date;
	checkInTime: Date;
	checkOutDate: Date;
	checkOutTime: Date;
  cost?: string | null;
  notes?: string | null;
  attachments?: StayAttachments[]
};

export type StayTraveler = {
  id?: number;
  createdAt?: Date;
  stay_id: number;
  traveler_id: number;
  traveler_full_name: string;
};

export type StayAttachments = {
  id?: number | string;
  createdAt?: string;
  stayId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}