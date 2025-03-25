import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

interface Stay {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	placeName: string;
	placeAddress: string;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
	travelers?: Traveler[];
	cost?: string;
	attachments?: File[];
	notes?: string;
}

interface StayState {
	stays: Stay[];
}

const initialState: StayState = {
	stays: [],
};

const staySlice = createSlice({
	name: "Stay",
	initialState,
	reducers: {
		addStay: (state, action: PayloadAction<Stay>) => {
			state.stays.push(action.payload);
		},
		updateStay: (state, action: PayloadAction<Stay>) => {
			const index = state.stays.findIndex(
				(stay) => stay.id === action.payload.id
			);
			if (index !== -1) {
				state.stays[index] = action.payload;
			}
		},

		deleteStay: (state, action: PayloadAction<string>) => {
			state.stays = state.stays.filter(
				(stay) => stay.id !== action.payload
			);
		},
	},
});

export const { addStay, updateStay, deleteStay } = staySlice.actions;
export default staySlice.reducer;
