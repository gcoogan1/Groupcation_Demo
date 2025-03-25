import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

interface Bus {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	busRoute: string;
	busClass: string;
	departureBusStop: string;
	departureDate: string;
	departureTime: string;
	arrivalBusStop: string;
	arrivalDate: string;
	arrivalTime: string;
	travelers?: Traveler[];
	cost?: string;
	attachments?: File[];
	notes?: string;
}

interface BusState {
	buses: Bus[];
}

const initialState: BusState = {
	buses: [],
};

const busSlice = createSlice({
	name: "Bus",
	initialState,
	reducers: {
		addBus: (state, action: PayloadAction<Bus>) => {
			state.buses.push(action.payload);
		},
		updateBus: (state, action: PayloadAction<Bus>) => {
			const index = state.buses.findIndex(
				(bus) => bus.id === action.payload.id
			);
			if (index !== -1) {
				state.buses[index] = action.payload;
			}
		},

		deleteBus: (state, action: PayloadAction<string>) => {
			state.buses = state.buses.filter(
				(bus) => bus.id !== action.payload
			);
		},
	},
});

export const { addBus, updateBus, deleteBus } = busSlice.actions;
export default busSlice.reducer;
