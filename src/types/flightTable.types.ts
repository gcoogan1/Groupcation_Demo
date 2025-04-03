type FlightClass = "economy" | "premiumEconomy" | "business" | "firstClass";

export type FlightTable = {
  id?: number;
  createdAt?: Date;
  createdBy?: number;
  groupcationId?: number;
  airline: string;
  flightClass?: FlightClass;
  flightNumber?: string;
  departureAirport: string;
  departureDate: Date; 
  departureTime: Date;
  arrivalAirport: string;
  arrivalDate: Date;
  arrivalTime: Date;
  cost?: string | null;
  notes?: string | null;
};

export type FlightTraveler = {
  id?: number;
  createdAt?: Date;
  flight_id: number;
  traveler_id: number;
  traveler_full_name: string;
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