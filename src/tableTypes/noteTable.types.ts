
export type NoteUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  noteTitle: string;
	noteContent: string;
  startDate: string | Date; 
  startTime: string;
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
};