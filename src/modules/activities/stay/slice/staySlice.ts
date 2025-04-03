import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addStayAttachmentsTable, addStayTable, addStayTravelersTable, deleteStayAttachment, deleteStayTable, deleteStayTraveler, fetchStayByGroupcationId, fetchStayTable, updateStayTable } from "../thunk/stayThunk";
import { StayAttachments } from "../../../../types/stayTable.types";

type Traveler = {
	value: number;
	label: string;
};

interface Stay {
	id: string;
	groupcationId: number;
	createdBy: number;
	placeName: string;
	placeAddress: string;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
	travelers?: Traveler[];
	cost?: string;
	attachments?: StayAttachments[];
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
	reducers: {},
		extraReducers: (builder) => {
			builder
				// FETCH STAY
				.addCase(
					fetchStayTable.fulfilled,
					(state, action: PayloadAction<Stay[]>) => {
						action.payload.forEach((newStay) => {
							// Check if the stay already exists in state
							const index = state.stays.findIndex(
								(stay) => stay.id === newStay.id
							);
							// Update existing stay data
							// findIndex() (used above) returns -1 if no match is found. 
							// If the flight exists in the array, index will be 0 or greater.
							if (index !== -1) {
								state.stays[index] = newStay;
							} else {
								// Add new stay to state
								state.stays.push(newStay);
							}
						});
					}
				)
				// ADD NEW STAY
				.addCase(
					addStayTable.fulfilled,
					(state, action: PayloadAction<Stay>) => {
						state.stays.push(action.payload);
					}
				)
				// UPDATE STAY
				.addCase(
					updateStayTable.fulfilled,
					(state, action: PayloadAction<Stay>) => {
						const updatedStay = action.payload;
						// Find the stay in the state
						const index = state.stays.findIndex(
							(stay) => stay.id === updatedStay.id
						);
						// Replace with updated data
						if (index !== -1) {
							state.stays[index] = updatedStay;
						}
					}
				)
				// DELETE STAY
				.addCase(
					deleteStayTable.fulfilled,
					(state, action: PayloadAction<string>) => {
						// Remove stay based in id
						state.stays = state.stays.filter(
							(stay) => stay.id !== action.payload
						);
					}
				)
				// FETCH STAY BY GROUPCATION ID
				.addCase(
					fetchStayByGroupcationId.fulfilled,
					(state, action: PayloadAction<Stay[]>) => {
						// Replace current stay state with fetched stays for the groupcation
						state.stays = action.payload;
					}
				)
				// ADD STAY ATTACHMENT
				.addCase(
					addStayAttachmentsTable.fulfilled,
					(state, action: PayloadAction<StayAttachments[]>) => {
						action.payload.forEach((attachment) => {
							// Find the stay associated with this attachment
							const stay = state.stays.find(
								(t) => Number(t.id) === attachment.stayId
							);
							// Append the new attachment(s) to the existing list
							if (stay) {
								stay.attachments = [...(stay.attachments || []), attachment];
							}
						});
					}
				)
				// DELETE STAY ATTACHMENT
				.addCase(
					deleteStayAttachment.fulfilled,
					(
						state,
						action: PayloadAction<
							{ attachmentId: number | string; stayId: string } | undefined
						>
					) => {
						// Avoids breaking if payload is undefined
						if (!action.payload) return;
	
						const { attachmentId, stayId } = action.payload;
	
						// Find the stay
						const stay = state.stays.find(
							(t) => Number(t.id) === Number(stayId)
						);
						if (stay) {
							// Remove deleted attachment from the stay's attachments
							stay.attachments =
								stay.attachments?.filter((att) => att.id !== attachmentId) || [];
						}
					}
				)
				// ADD STAY TRAVELERS
				.addCase(
					addStayTravelersTable.fulfilled,
					(
						state,
						action: PayloadAction<{ travelers: Traveler[]; stayId: string }>
					) => {
						const { travelers, stayId } = action.payload;
	
						// Find the stay associated with this stayId
						const stay = state.stays.find(
							(t) => String(t.id) === String(stayId)
						);
	
						if (stay) {
							// Append new travelers to the existing list
							stay.travelers = [...(stay.travelers || []), ...travelers];
						}
					}
				)
				// DELETE STAY TRAVELER
				.addCase(
					deleteStayTraveler.fulfilled,
					(
						state,
						action: PayloadAction<
							{ travelerId: number | string; stayId: string } | undefined
						>
					) => {
						if (!action.payload) return;
	
						const { travelerId, stayId } = action.payload;
	
						// Find the stay
						const stay = state.stays.find(
							(t) => Number(t.id) === Number(stayId)
						);
	
						if (stay) {
							// Remove deleted traveler from the stay's travelers
							stay.travelers =
								stay.travelers?.filter((att) => att.value !== travelerId) || [];
						}
					}
				);
		},
});

export default staySlice.reducer;
