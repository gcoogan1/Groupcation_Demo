import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

interface Boat {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	boatCruiseLine: string;
	boatCruiseClass: string;
	departureDock: string;
	departureDate: string;
	departureTime: string;
	arrivalDock: string;
	arrivalDate: string;
	arrivalTime: string;
	travelers?: Traveler[];
	cost?: string;
	attachments?: File[];
	notes?: string;
}

interface BoatState {
	boats: Boat[];
}

const initialState: BoatState = {
	boats: [],
};

const boatSlice = createSlice({
	name: "Boat",
	initialState,
	reducers: {
		addBoat: (state, action: PayloadAction<Boat>) => {
			state.boats.push(action.payload);
		},
		updateBoat: (state, action: PayloadAction<Boat>) => {
			const index = state.boats.findIndex(
				(boat) => boat.id === action.payload.id
			);
			if (index !== -1) {
				state.boats[index] = action.payload;
			}
		},

		deleteBoat: (state, action: PayloadAction<string>) => {
			state.boats = state.boats.filter(
				(boat) => boat.id !== action.payload
			);
		},
	},
});

export const { addBoat, updateBoat, deleteBoat } = boatSlice.actions;
export default boatSlice.reducer;
