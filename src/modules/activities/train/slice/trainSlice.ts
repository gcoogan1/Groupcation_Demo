import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

interface Train {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	railwayLine: string;
	class: string;
	departureStation: string;
	departureDate: Date;
	departureTime: Date;
	arrivalStation: string;
	arrivalDate: Date;
	arrivalTime: Date;
	travelers?: Traveler[];
	cost?: string;
	attachments?: File[];
	notes?: string;
}

interface TrainState {
	trains: Train[];
}

const initialState: TrainState = {
	trains: [],
};

const trainSlice = createSlice({
	name: "train",
	initialState,
	reducers: {
		addTrain: (state, action: PayloadAction<Train>) => {
			state.trains.push(action.payload);
		},
		updateTrain: (state, action: PayloadAction<Train>) => {
			const index = state.trains.findIndex(
				(train) => train.id === action.payload.id
			);
			if (index !== -1) {
				state.trains[index] = action.payload;
			}
		},

		deleteTrain: (state, action: PayloadAction<string>) => {
			state.trains = state.trains.filter(
				(train) => train.id !== action.payload
			);
		},
	},
});

export const { addTrain, updateTrain, deleteTrain } = trainSlice.actions;
export default trainSlice.reducer;
