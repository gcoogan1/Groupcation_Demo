type Traveler = {
  value: number;
  label: string;
};

export type CelebrationUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  celebrationName: string;
	celebrationLocation: string;
  startDate: string | Date; 
  startTime: string;
  endDate: string;
  endTime: string;
  celebrationType: string;
  cost?: string;
  notes?: string;
  attachments?: CelebrationAttachments[],
  travelers?: CelebrationTraveler[];
}

export type CelebrationTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  celebrationName: string;
	celebrationLocation: string;
  startDate: Date; 
  startTime: Date;
  endDate: Date;
  endTime: Date;
  celebrationType: string;
  cost?: string | null;
  notes?: string | null;
  attachments?: CelebrationAttachments[],
  travelers?: Traveler[];
};

export type CelebrationTraveler = {
  id?: number;
  createdAt?: Date;
  celebration_id: number;
  traveler_id: number;
  traveler_full_name: string;
};

export type CelebrationAttachments = {
  id?: number | string;
  createdAt?: string;
  celebrationId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}