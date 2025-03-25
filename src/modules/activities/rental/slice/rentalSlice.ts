import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

interface Rental {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	rentalAgency: string;
	carType: string;
	pickUpLocation: string;
	pickUpDate: string;
	pickUpTime: string;
	dropOffLocation?: string;
	dropOffDate: string;
	dropOffTime: string;
	travelers?: Traveler[];
	cost?: string;
	attachments?: File[];
	notes?: string;
}

interface RentalState {
	rentals: Rental[];
}

const initialState: RentalState = {
	rentals: [],
};

const rentalSlice = createSlice({
	name: "rental",
	initialState,
	reducers: {
		addRental: (state, action: PayloadAction<Rental>) => {
			state.rentals.push(action.payload);
		},
		updateRental: (state, action: PayloadAction<Rental>) => {
			const index = state.rentals.findIndex(
				(rental) => rental.id === action.payload.id
			);
			if (index !== -1) {
				state.rentals[index] = action.payload;
			}
		},

		deleteRental: (state, action: PayloadAction<string>) => {
			state.rentals = state.rentals.filter(
				(rental) => rental.id !== action.payload
			);
		},
	},
});

export const { addRental, updateRental, deleteRental } = rentalSlice.actions;
export default rentalSlice.reducer;
