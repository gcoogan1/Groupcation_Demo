type Traveler = {
  value: number;
  label: string;
};

export type RestaurantUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  restaurantName: string;
	restaurantAddress: string;
	tableType?: string;
  reservationDate: string | Date; 
  reservationTime: string;
  cost?: string;
  notes?: string;
  attachments?: RestaurantAttachments[],
  travelers?: RestaurantTraveler[];
}

export type RestaurantTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  restaurantName: string;
	restaurantAddress: string;
	tableType?: string;
  reservationDate: Date; 
  reservationTime: Date;
  cost?: string | null;
  notes?: string | null;
  attachments?: RestaurantAttachments[], // ONLY FOR UI
  travelers?: Traveler[]; // ONLY FOR UI
};

export type RestaurantTraveler = {
  id?: number;
  createdAt?: Date;
  restaurant_id: number;
  traveler_id: number;
  traveler_full_name: string;
};

export type RestaurantAttachments = {
  id?: number | string;
  createdAt?: string;
  restaurantId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}