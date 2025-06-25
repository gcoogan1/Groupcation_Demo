type FlightClass = "economy" | "premiumEconomy" | "business" | "firstClass";

type Traveler = {
  value: number;
  label: string;
};

export type FlightUITable = {
  id: string;
  createdAt: string;
  createdBy: number;
  groupcationId?: number;
  airline: string;
  flightDuration: string;
  flightClass?: FlightClass;
  flightNumber?: string;
  departureDate: string | Date; 
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  cost?: string;
  notes?: string;
  departureAirport: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalCity: string;
  attachments?: FlightAttachments[],
  travelers?: FlightTraveler[];
}

export type FlightTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  airline: string;
  flightDuration: string;
  flightClass?: FlightClass;
  flightNumber?: string;
  departureAirport: string;
  departureCity: string;
  departureDate: Date; 
  departureTime: Date;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalDate: Date;
  arrivalTime: Date;
  cost?: string | null;
  notes?: string | null;
  attachments?: FlightAttachments[]; //ONLY FOR UI
  travelers?: Traveler[];  // ONLY FOR UI
};

export type FlightTraveler = {
  id?: number;
  createdAt?: Date;
  flightId: number;
  travelerId: number;
  travelerFullName: string;
};

export type FlightAttachments = {
  id?: number | string;
  createdAt?: string;
  flightId?: number;
  addedBy?: number;
	fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
	file?: File;
}