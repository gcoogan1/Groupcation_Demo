
type Traveler = {
  value: number;
  label: string;
};

export type NoteUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  noteTitle: string;
	noteContent: string;
  startDate: string | Date; 
  startTime: string;
  travelers?: NoteTraveler[]
}

export type NoteTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  noteTitle: string;
	noteContent: string;
  startDate: Date; 
  startTime: Date;
  travelers?: Traveler[] // ONLY FOR UI
};

export type NoteTraveler = {
  id?: number;
  createdAt?: Date;
  noteId: number;
  travelerId: number;
  travelerFullName: string;
};