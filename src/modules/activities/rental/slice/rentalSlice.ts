import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RentalAttachments } from "../../../../types/rentalTable.types";
import { fetchRentalTable, addRentalTable, updateRentalTable, deleteRentalTable, fetchRentalByGroupcationId, addRentalAttachmentsTable, deleteRentalAttachment, addRentalTravelersTable, deleteRentalTraveler } from "../thunk/rentalThunk";

type Traveler = {
	value: number;
	label: string;
};

interface Rental {
	id: string;
	groupcationId?: number;
  createdBy?: number;
	rentalAgency: string;
	carType: string;
	pickUpLocation: string;
	pickUpDate: string;
	pickUpTime: string;
	dropOffLocation: string;
	dropOffDate: string;
	dropOffTime: string;
	travelers?: Traveler[];
	cost?: string;
	attachments?: RentalAttachments[];
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
	reducers: {},
	extraReducers: (builder) => {
			builder
				// FETCH RENTAL
				.addCase(
					fetchRentalTable.fulfilled,
					(state, action: PayloadAction<Rental[]>) => {
						action.payload.forEach((newRental) => {
							// Check if the rental already exists in state
							const index = state.rentals.findIndex(
								(rental) => rental.id === newRental.id
							);
							// Update existing rental data
							// findIndex() (used above) returns -1 if no match is found. 
							// If the flight exists in the array, index will be 0 or greater.
							if (index !== -1) {
								state.rentals[index] = newRental;
							} else {
								// Add new rental to state
								state.rentals.push(newRental);
							}
						});
					}
				)
				// ADD NEW RENTAL
				.addCase(
					addRentalTable.fulfilled,
					(state, action: PayloadAction<Rental>) => {
						state.rentals.push(action.payload);
					}
				)
				// UPDATE RENTAL
				.addCase(
					updateRentalTable.fulfilled,
					(state, action: PayloadAction<Rental>) => {
						const updatedRental = action.payload;
						// Find the rental in the state
						const index = state.rentals.findIndex(
							(rental) => rental.id === updatedRental.id
						);
						// Replace with updated data
						if (index !== -1) {
							state.rentals[index] = updatedRental;
						}
					}
				)
				// DELETE RENTAL
				.addCase(
					deleteRentalTable.fulfilled,
					(state, action: PayloadAction<string>) => {
						// Remove rental based in id
						state.rentals = state.rentals.filter(
							(rental) => rental.id !== action.payload
						);
					}
				)
				// FETCH RENTAL BY GROUPCATION ID
				.addCase(
					fetchRentalByGroupcationId.fulfilled,
					(state, action: PayloadAction<Rental[]>) => {
						// Replace current rental state with fetched rentals for the groupcation
						state.rentals = action.payload;
					}
				)
				// ADD RENTAL ATTACHMENT
				.addCase(
					addRentalAttachmentsTable.fulfilled,
					(state, action: PayloadAction<RentalAttachments[]>) => {
						action.payload.forEach((attachment) => {
							// Find the rental associated with this attachment
							const rental = state.rentals.find(
								(t) => Number(t.id) === attachment.rentalId
							);
							// Append the new attachment(s) to the existing list
							if (rental) {
								rental.attachments = [...(rental.attachments || []), attachment];
							}
						});
					}
				)
				// DELETE RENTAL ATTACHMENT
				.addCase(
					deleteRentalAttachment.fulfilled,
					(
						state,
						action: PayloadAction<
							{ attachmentId: number | string; rentalId: string } | undefined
						>
					) => {
						// Avoids breaking if payload is undefined
						if (!action.payload) return;
	
						const { attachmentId, rentalId } = action.payload;
	
						// Find the rental
						const rental = state.rentals.find(
							(t) => Number(t.id) === Number(rentalId)
						);
						if (rental) {
							// Remove deleted attachment from the rental's attachments
							rental.attachments =
								rental.attachments?.filter((att) => att.id !== attachmentId) || [];
						}
					}
				)
				// ADD RENTAL TRAVELERS
				.addCase(
					addRentalTravelersTable.fulfilled,
					(
						state,
						action: PayloadAction<{ travelers: Traveler[]; rentalId: string }>
					) => {
						const { travelers, rentalId } = action.payload;
	
						// Find the rental associated with this rentalId
						const rental = state.rentals.find(
							(t) => String(t.id) === String(rentalId)
						);
	
						if (rental) {
							// Append new travelers to the existing list
							rental.travelers = [...(rental.travelers || []), ...travelers];
						}
					}
				)
				// DELETE RENTAL TRAVELER
				.addCase(
					deleteRentalTraveler.fulfilled,
					(
						state,
						action: PayloadAction<
							{ travelerId: number | string; rentalId: string } | undefined
						>
					) => {
						if (!action.payload) return;
	
						const { travelerId, rentalId } = action.payload;
	
						// Find the rental
						const rental = state.rentals.find(
							(t) => Number(t.id) === Number(rentalId)
						);
	
						if (rental) {
							// Remove deleted traveler from the rental's travelers
							rental.travelers =
								rental.travelers?.filter((att) => att.value !== travelerId) || [];
						}
					}
				);
		}
});

export default rentalSlice.reducer;
