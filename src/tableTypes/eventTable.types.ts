type Traveler = {
  value: number;
  label: string;
};

export type EventUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  eventName: string;
	eventLocation: string;
  startDate: string | Date; 
  startTime: string;
  endDate: string;
  endTime: string;
  eventOrganizer: string;
  ticketType: string;
  cost?: string;
  notes?: string;
  attachments?: EventAttachments[],
  travelers?: EventTraveler[];
}

export type EventTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  eventName: string;
	eventLocation: string;
  startDate: Date; 
  startTime: Date;
  endDate: Date;
  endTime: Date;
  eventOrganizer: string;
  ticketType: string;
  cost?: string | null;
  notes?: string | null;
  attachments?: EventAttachments[],
  travelers?: Traveler[];
};

export type EventTraveler = {
  id?: number;
  createdAt?: Date;
  eventId: number;
  travelerId: number;
  travelerFullName: string;
};

export type EventAttachments = {
  id?: number | string;
  createdAt?: string;
  eventId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}