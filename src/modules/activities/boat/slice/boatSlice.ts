import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoatAttachments } from "../../../../types/boatTable.types";
import { fetchBoatTable, addBoatTable, updateBoatTable, deleteBoatTable, fetchBoatByGroupcationId, addBoatAttachmentsTable, deleteBoatAttachment, addBoatTravelersTable, deleteBoatTraveler } from "../thunk/boatThunk";

type Traveler = {
	value: number;
	label: string;
};

interface Boat {
	id: string;
  groupcationId?: number;
  createdBy?: number;
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
	attachments?: BoatAttachments[];
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
	reducers: {},
	 extraReducers: (builder) => {
			builder
				// FETCH BOAT
				.addCase(
					fetchBoatTable.fulfilled,
					(state, action: PayloadAction<Boat[]>) => {
						action.payload.forEach((newBoat) => {
							// Check if the boat already exists in state
							const index = state.boats.findIndex(
								(boat) => boat.id === newBoat.id
							);
							// Update existing boat data
							// findIndex() (used above) returns -1 if no match is found. 
							// If the flight exists in the array, index will be 0 or greater.
							if (index !== -1) {
								state.boats[index] = newBoat;
							} else {
								// Add new boat to state
								state.boats.push(newBoat);
							}
						});
					}
				)
				// ADD NEW BOAT
				.addCase(
					addBoatTable.fulfilled,
					(state, action: PayloadAction<Boat>) => {
						state.boats.push(action.payload);
					}
				)
				// UPDATE BOAT
				.addCase(
					updateBoatTable.fulfilled,
					(state, action: PayloadAction<Boat>) => {
						const updatedBoat = action.payload;
						// Find the boat in the state
						const index = state.boats.findIndex(
							(boat) => boat.id === updatedBoat.id
						);
						// Replace with updated data
						if (index !== -1) {
							state.boats[index] = updatedBoat;
						}
					}
				)
				// DELETE BOAT
				.addCase(
					deleteBoatTable.fulfilled,
					(state, action: PayloadAction<string>) => {
						// Remove boat based in id
						state.boats = state.boats.filter(
							(boat) => boat.id !== action.payload
						);
					}
				)
				// FETCH BOAT BY GROUPCATION ID
				.addCase(
					fetchBoatByGroupcationId.fulfilled,
					(state, action: PayloadAction<Boat[]>) => {
						// Replace current boat state with fetched boats for the groupcation
						state.boats = action.payload;
					}
				)
				// ADD BOAT ATTACHMENT
				.addCase(
					addBoatAttachmentsTable.fulfilled,
					(state, action: PayloadAction<BoatAttachments[]>) => {
						action.payload.forEach((attachment) => {
							// Find the boat associated with this attachment
							const boat = state.boats.find(
								(t) => Number(t.id) === attachment.boatId
							);
							// Append the new attachment(s) to the existing list
							if (boat) {
								boat.attachments = [...(boat.attachments || []), attachment];
							}
						});
					}
				)
				// DELETE BOAT ATTACHMENT
				.addCase(
					deleteBoatAttachment.fulfilled,
					(
						state,
						action: PayloadAction<
							{ attachmentId: number | string; boatId: string } | undefined
						>
					) => {
						// Avoids breaking if payload is undefined
						if (!action.payload) return;
	
						const { attachmentId, boatId } = action.payload;
	
						// Find the boat
						const boat = state.boats.find(
							(t) => Number(t.id) === Number(boatId)
						);
						if (boat) {
							// Remove deleted attachment from the boat's attachments
							boat.attachments =
								boat.attachments?.filter((att) => att.id !== attachmentId) || [];
						}
					}
				)
				// ADD BOAT TRAVELERS
				.addCase(
					addBoatTravelersTable.fulfilled,
					(
						state,
						action: PayloadAction<{ travelers: Traveler[]; boatId: string }>
					) => {
						const { travelers, boatId } = action.payload;
	
						// Find the boat associated with this boatId
						const boat = state.boats.find(
							(t) => String(t.id) === String(boatId)
						);
	
						if (boat) {
							// Append new travelers to the existing list
							boat.travelers = [...(boat.travelers || []), ...travelers];
						}
					}
				)
				// DELETE BOAT TRAVELER
				.addCase(
					deleteBoatTraveler.fulfilled,
					(
						state,
						action: PayloadAction<
							{ travelerId: number | string; boatId: string } | undefined
						>
					) => {
						if (!action.payload) return;
	
						const { travelerId, boatId } = action.payload;
	
						// Find the boat
						const boat = state.boats.find(
							(t) => Number(t.id) === Number(boatId)
						);
	
						if (boat) {
							// Remove deleted traveler from the boat's travelers
							boat.travelers =
								boat.travelers?.filter((att) => att.value !== travelerId) || [];
						}
					}
				);
		}
});

export default boatSlice.reducer;
