import { LinkedTripAttachments } from "@/tableTypes/linkedTripsTable.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchLinkedTripTable, addLinkedTripTable, updateLinkedTripTable, deleteLinkedTripTable, fetchLinkedTripByGroupcationId, addLinkedTripAttachmentsTable, deleteLinkedTripAttachment, addLinkedTripTravelersTable, deleteLinkedTripTraveler } from "../thunk/linkedTripThunk";

type Traveler = {
	value: number;
	label: string;
};

interface LinkedTrip {
	id: string;
	groupcationId?: number;
  createdBy?: number;
	linkedTripTitle: string;
	startDate: string;
	endDate: string;
	travelers?: Traveler[];
	attachments?: LinkedTripAttachments[];
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
	reducers: {},
		extraReducers: (builder) => {
			builder
				// FETCH LINKED TRIP
				.addCase(
					fetchLinkedTripTable.fulfilled,
					(state, action: PayloadAction<LinkedTrip[]>) => {
						action.payload.forEach((newLinkedTrip) => {
							// Check if the linkedTrip already exists in state
							const index = state.linkedTrips.findIndex(
								(linkedTrip) => linkedTrip.id === newLinkedTrip.id
							);
							// Update existing linkedTrip data
							// findIndex() (used above) returns -1 if no match is found.
							// If the flight exists in the array, index will be 0 or greater.
							if (index !== -1) {
								state.linkedTrips[index] = newLinkedTrip;
							} else {
								// Add new linkedTrip to state
								state.linkedTrips.push(newLinkedTrip);
							}
						});
					}
				)
				// ADD NEW LINKED TRIP
				.addCase(
					addLinkedTripTable.fulfilled,
					(state, action: PayloadAction<LinkedTrip>) => {
						state.linkedTrips.push(action.payload);
					}
				)
				// UPDATE LINKED TRIP
				.addCase(
					updateLinkedTripTable.fulfilled,
					(state, action: PayloadAction<LinkedTrip>) => {
						const updatedLinkedTrip = action.payload;
						// Find the linkedTrip in the state
						const index = state.linkedTrips.findIndex(
							(linkedTrip) => linkedTrip.id === updatedLinkedTrip.id
						);
						// Replace with updated data
						if (index !== -1) {
							state.linkedTrips[index] = updatedLinkedTrip;
						}
					}
				)
				// DELETE LINKED TRIP
				.addCase(
					deleteLinkedTripTable.fulfilled,
					(state, action: PayloadAction<string>) => {
						// Remove linkedTrip based in id
						state.linkedTrips = state.linkedTrips.filter(
							(linkedTrip) => linkedTrip.id !== action.payload
						);
					}
				)
				// FETCH LINKED TRIP BY GROUPCATION ID
				.addCase(
					fetchLinkedTripByGroupcationId.fulfilled,
					(state, action: PayloadAction<LinkedTrip[]>) => {
						// Replace current linkedTrip state with fetched linkedTrips for the groupcation
						state.linkedTrips = action.payload;
					}
				)
				// ADD LINKED TRIP ATTACHMENT
				.addCase(
					addLinkedTripAttachmentsTable.fulfilled,
					(state, action: PayloadAction<LinkedTripAttachments[]>) => {
						action.payload.forEach((attachment) => {
							// Find the linkedTrip associated with this attachment
							const linkedTrip = state.linkedTrips.find(
								(t) => Number(t.id) === attachment.linkedTripId
							);
							// Append the new attachment(s) to the existing list
							if (linkedTrip) {
								linkedTrip.attachments = [...(linkedTrip.attachments || []), attachment];
							}
						});
					}
				)
				// DELETE LINKED TRIP ATTACHMENT
				.addCase(
					deleteLinkedTripAttachment.fulfilled,
					(
						state,
						action: PayloadAction<
							{ attachmentId: number | string; linkedTripId: string } | undefined
						>
					) => {
						// Avoids breaking if payload is undefined
						if (!action.payload) return;
	
						const { attachmentId, linkedTripId } = action.payload;
	
						// Find the linkedTrip
						const linkedTrip = state.linkedTrips.find(
							(t) => Number(t.id) === Number(linkedTripId)
						);
						if (linkedTrip) {
							// Remove deleted attachment from the linkedTrip's attachments
							linkedTrip.attachments =
								linkedTrip.attachments?.filter((att) => att.id !== attachmentId) || [];
						}
					}
				)
				// ADD LINKED TRIP TRAVELERS
				.addCase(
					addLinkedTripTravelersTable.fulfilled,
					(
						state,
						action: PayloadAction<{ travelers: Traveler[]; linkedTripId: string }>
					) => {
						const { travelers, linkedTripId } = action.payload;
	
						// Find the linkedTrip associated with this linkedTripId
						const linkedTrip = state.linkedTrips.find(
							(t) => String(t.id) === String(linkedTripId)
						);
	
						if (linkedTrip) {
							// Append new travelers to the existing list
							linkedTrip.travelers = [...(linkedTrip.travelers || []), ...travelers];
						}
					}
				)
				// DELETE LINKED TRIP TRAVELER
				.addCase(
					deleteLinkedTripTraveler.fulfilled,
					(
						state,
						action: PayloadAction<
							{ travelerId: number | string; linkedTripId: string } | undefined
						>
					) => {
						if (!action.payload) return;
	
						const { travelerId, linkedTripId } = action.payload;
	
						// Find the linkedTrip
						const linkedTrip = state.linkedTrips.find(
							(t) => Number(t.id) === Number(linkedTripId)
						);
	
						if (linkedTrip) {
							// Remove deleted traveler from the linkedTrip's travelers
							linkedTrip.travelers =
								linkedTrip.travelers?.filter((att) => att.value !== travelerId) || [];
						}
					}
				);
		},
});

export default linkedTripSlice.reducer;
