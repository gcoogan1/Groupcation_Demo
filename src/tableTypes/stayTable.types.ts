
type Traveler = {
  value: number;
  label: string;
};

export type StayUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
	placeName: string;
	placeAddress: string;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
  cost?: string;
  notes?: string;
  attachments?: StayAttachments[] // ONLY FOR UI
  travelers?: StayTraveler[]; // ONLY FOR UI
};

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
  attachments?: StayAttachments[] // ONLY FOR UI
  travelers?: Traveler[]; // ONLY FOR UI
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