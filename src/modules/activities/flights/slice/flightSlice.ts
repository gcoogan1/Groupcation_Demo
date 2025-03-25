import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

type FlightClass = "economy" | "premiumEconomy" | "business" | "firstClass";

interface Flight {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	airline: string;
	flightClass: FlightClass;
  flightNumber: string;
	departureAirport: string;
	departureDate: string;
	departureTime: string;
	arrivalAirport: string;
	arrivalDate: string;
	arrivalTime: string;
	travelers?: Traveler[];
	cost?: string;
	attachments?: File[];
	notes?: string;
}

interface FlightState {
	flights: Flight[];
}

const initialState: FlightState = {
	flights: [],
};

const flightSlice = createSlice({
	name: "Flight",
	initialState,
	reducers: {
		addFlight: (state, action: PayloadAction<Flight>) => {
			state.flights.push(action.payload);
		},
		updateFlight: (state, action: PayloadAction<Flight>) => {
			const index = state.flights.findIndex(
				(Flight) => Flight.id === action.payload.id
			);
			if (index !== -1) {
				state.flights[index] = action.payload;
			}
		},

		deleteFlight: (state, action: PayloadAction<string>) => {
			state.flights = state.flights.filter(
				(Flight) => Flight.id !== action.payload
			);
		},
	},
});

export const { addFlight, updateFlight, deleteFlight } = flightSlice.actions;
export default flightSlice.reducer;
