type Traveler = {
  value: number;
  label: string;
};

export type RentalUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  rentalAgency: string;
	carType: string;
	pickUpLocation: string;
  pickUpDate: string | Date; 
  pickUpTime: string;
  dropOffLocation?: string;
  dropOffDate: string;
  dropOffTime: string;
  cost?: string;
  notes?: string;
  attachments?: RentalAttachments[],
  travelers?: RentalTraveler[];
}

export type RentalTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  rentalAgency: string;
	carType: string;
	pickUpLocation: string;
  pickUpDate: Date; 
  pickUpTime: Date;
  dropOffLocation?: string;
  dropOffDate: Date;
  dropOffTime: Date;
  cost?: string | null;
  notes?: string | null;
  attachments?: RentalAttachments[], // ONLY FOR UI
  travelers?: Traveler[]; // ONLY FOR UI
};

export type RentalTraveler = {
  id?: number;
  createdAt?: Date;
  rentalId: number;
  travelerId: number;
  travelerFullName: string;
};

export type RentalAttachments = {
  id?: number | string;
  createdAt?: string;
  rentalId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}