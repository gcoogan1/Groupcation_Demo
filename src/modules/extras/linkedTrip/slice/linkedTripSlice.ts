import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

interface LinkedTrip {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	linkedTripTitle: string;
	startDate: string;
	endDate: string;
	travelers?: Traveler[];
	attachments?: File[];
}

interface LinkedTripState {
	linkedTrips: LinkedTrip[];
}

const initialState: LinkedTripState = {
	linkedTrips: [],
};

const linkedTripSlice = createSlice({
	name: "linkedTrip",
	initialState,
	reducers: {
		addLinkedTrip: (state, action: PayloadAction<LinkedTrip>) => {
			state.linkedTrips.push(action.payload);
		},
		updateLinkedTrip: (state, action: PayloadAction<LinkedTrip>) => {
			const index = state.linkedTrips.findIndex(
				(linkedTrip) => linkedTrip.id === action.payload.id
			);
			if (index !== -1) {
				state.linkedTrips[index] = action.payload;
			}
		},

		deleteLinkedTrip: (state, action: PayloadAction<string>) => {
			state.linkedTrips = state.linkedTrips.filter(
				(linkedTrip) => linkedTrip.id !== action.payload
			);
		},
	},
});

export const { addLinkedTrip, updateLinkedTrip, deleteLinkedTrip } = linkedTripSlice.actions;
export default linkedTripSlice.reducer;
