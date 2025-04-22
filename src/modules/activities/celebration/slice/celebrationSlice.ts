import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CelebrationAttachments } from "@tableTypes/celebrationTable.types";
import {
  fetchCelebrationTable,
  addCelebrationTable,
  updateCelebrationTable,
  deleteCelebrationTable,
  fetchCelebrationByGroupcationId,
  addCelebrationAttachmentsTable,
  deleteCelebrationAttachment,
  addCelebrationTravelersTable,
  deleteCelebrationTraveler,
} from "../thunk/celebrationThunk";

type Traveler = {
  value: number;
  label: string;
};

interface Celebration {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  celebrationName: string;
  celebrationLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  celebrationOrganizer: string;
  ticketType: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: CelebrationAttachments[];
  notes?: string;
}

interface CelebrationState {
  celebrations: Celebration[];
}

const initialState: CelebrationState = {
  celebrations: [],
};

const celebrationSlice = createSlice({
  name: "celebration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH CELEBRATION
      .addCase(
        fetchCelebrationTable.fulfilled,
        (state, action: PayloadAction<Celebration[]>) => {
          action.payload.forEach((newCelebration) => {
            // Check if the celebration already exists in state
            const index = state.celebrations.findIndex(
              (celebration) => celebration.id === newCelebration.id
            );
            // Update existing celebration data
            // findIndex() (used above) returns -1 if no match is found.
            // If the flight exists in the array, index will be 0 or greater.
            if (index !== -1) {
              state.celebrations[index] = newCelebration;
            } else {
              // Add new celebration to state
              state.celebrations.push(newCelebration);
            }
          });
        }
      )
      // ADD NEW CELEBRATION
      .addCase(
        addCelebrationTable.fulfilled,
        (state, action: PayloadAction<Celebration>) => {
          state.celebrations.push(action.payload);
        }
      )
      // UPDATE CELEBRATION
      .addCase(
        updateCelebrationTable.fulfilled,
        (state, action: PayloadAction<Celebration>) => {
          const updatedCelebration = action.payload;
          // Find the celebration in the state
          const index = state.celebrations.findIndex(
            (celebration) => celebration.id === updatedCelebration.id
          );
          // Replace with updated data
          if (index !== -1) {
            state.celebrations[index] = updatedCelebration;
          }
        }
      )
      // DELETE CELEBRATION
      .addCase(
        deleteCelebrationTable.fulfilled,
        (state, action: PayloadAction<string>) => {
          // Remove celebration based in id
          state.celebrations = state.celebrations.filter(
            (celebration) => celebration.id !== action.payload
          );
        }
      )
      // FETCH CELEBRATION BY GROUPCATION ID
      .addCase(
        fetchCelebrationByGroupcationId.fulfilled,
        (state, action: PayloadAction<Celebration[]>) => {
          // Replace current celebration state with fetched celebrations for the groupcation
          state.celebrations = action.payload;
        }
      )
      // ADD CELEBRATION ATTACHMENT
      .addCase(
        addCelebrationAttachmentsTable.fulfilled,
        (state, action: PayloadAction<CelebrationAttachments[]>) => {
          action.payload.forEach((attachment) => {
            // Find the celebration associated with this attachment
            const celebration = state.celebrations.find(
              (t) => Number(t.id) === attachment.celebrationId
            );
            // Append the new attachment(s) to the existing list
            if (celebration) {
              celebration.attachments = [
                ...(celebration.attachments || []),
                attachment,
              ];
            }
          });
        }
      )
      // DELETE CELEBRATION ATTACHMENT
      .addCase(
        deleteCelebrationAttachment.fulfilled,
        (
          state,
          action: PayloadAction<
            { attachmentId: number | string; celebrationId: string } | undefined
          >
        ) => {
          // Avoids breaking if payload is undefined
          if (!action.payload) return;

          const { attachmentId, celebrationId } = action.payload;

          // Find the celebration
          const celebration = state.celebrations.find(
            (t) => Number(t.id) === Number(celebrationId)
          );
          if (celebration) {
            // Remove deleted attachment from the celebration's attachments
            celebration.attachments =
              celebration.attachments?.filter(
                (att) => att.id !== attachmentId
              ) || [];
          }
        }
      )
      // ADD CELEBRATION TRAVELERS
      .addCase(
        addCelebrationTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{
            travelers: Traveler[];
            celebrationId: string;
          }>
        ) => {
          const { travelers, celebrationId } = action.payload;

          // Find the celebration associated with this celebrationId
          const celebration = state.celebrations.find(
            (t) => String(t.id) === String(celebrationId)
          );

          if (celebration) {
            // Append new travelers to the existing list
            celebration.travelers = [
              ...(celebration.travelers || []),
              ...travelers,
            ];
          }
        }
      )
      // DELETE CELEBRATION TRAVELER
      .addCase(
        deleteCelebrationTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; celebrationId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, celebrationId } = action.payload;

          // Find the celebration
          const celebration = state.celebrations.find(
            (t) => Number(t.id) === Number(celebrationId)
          );

          if (celebration) {
            // Remove deleted traveler from the celebration's travelers
            celebration.travelers =
              celebration.travelers?.filter(
                (att) => att.value !== travelerId
              ) || [];
          }
        }
      );
  },
});

export default celebrationSlice.reducer;
