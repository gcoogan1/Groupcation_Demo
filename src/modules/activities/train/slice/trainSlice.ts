import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addTrainAttachmentsTable,
  addTrainTable,
  addTrainTravelersTable,
  deleteTrainAttachment,
  deleteTrainTable,
  deleteTrainTraveler,
  fetchTrainByGroupcationId,
  fetchTrainTable,
  updateTrainTable,
} from "../thunk/trainThunk";
import { TrainAttachments } from "@tableTypes/trainTable.types";

type Traveler = {
  value: number;
  label: string;
};

interface Train {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  railwayLine: string;
  class: string;
  departureStation: string;
  departureDate: string;
  departureTime: string;
  arrivalStation: string;
  arrivalDate: string;
  arrivalTime: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: TrainAttachments[];
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH TRAIN
      .addCase(
        fetchTrainTable.fulfilled,
        (state, action: PayloadAction<Train[]>) => {
          action.payload.forEach((newTrain) => {
            // Check if the train already exists in state
            const index = state.trains.findIndex(
              (train) => train.id === newTrain.id
            );
            // Update existing train data
            // findIndex() (used above) returns -1 if no match is found.
            // If the flight exists in the array, index will be 0 or greater.
            if (index !== -1) {
              state.trains[index] = newTrain;
            } else {
              // Add new train to state
              state.trains.push(newTrain);
            }
          });
        }
      )
      // ADD NEW TRAIN
      .addCase(
        addTrainTable.fulfilled,
        (state, action: PayloadAction<Train>) => {
          state.trains.push(action.payload);
        }
      )
      // UPDATE TRAIN
      .addCase(
        updateTrainTable.fulfilled,
        (state, action: PayloadAction<Train>) => {
          const updatedTrain = action.payload;
          // Find the train in the state
          const index = state.trains.findIndex(
            (train) => train.id === updatedTrain.id
          );
          // Replace with updated data
          if (index !== -1) {
            state.trains[index] = updatedTrain;
          }
        }
      )
      // DELETE TRAIN
      .addCase(
        deleteTrainTable.fulfilled,
        (state, action: PayloadAction<string>) => {
          // Remove train based in id
          state.trains = state.trains.filter(
            (train) => train.id !== action.payload
          );
        }
      )
      // FETCH TRAIN BY GROUPCATION ID
      .addCase(
        fetchTrainByGroupcationId.fulfilled,
        (state, action: PayloadAction<Train[]>) => {
          // Replace current train state with fetched trains for the groupcation
          state.trains = action.payload;
        }
      )
      // ADD TRAIN ATTACHMENT
      .addCase(
        addTrainAttachmentsTable.fulfilled,
        (state, action: PayloadAction<TrainAttachments[]>) => {
          action.payload.forEach((attachment) => {
            // Find the train associated with this attachment
            const train = state.trains.find(
              (t) => Number(t.id) === attachment.trainId
            );
            // Append the new attachment(s) to the existing list
            if (train) {
              train.attachments = [...(train.attachments || []), attachment];
            }
          });
        }
      )
      // DELETE TRAIN ATTACHMENT
      .addCase(
        deleteTrainAttachment.fulfilled,
        (
          state,
          action: PayloadAction<
            { attachmentId: number | string; trainId: string } | undefined
          >
        ) => {
          // Avoids breaking if payload is undefined
          if (!action.payload) return;

          const { attachmentId, trainId } = action.payload;

          // Find the train
          const train = state.trains.find(
            (t) => Number(t.id) === Number(trainId)
          );
          if (train) {
            // Remove deleted attachment from the train's attachments
            train.attachments =
              train.attachments?.filter((att) => att.id !== attachmentId) || [];
          }
        }
      )
      // ADD TRAIN TRAVELERS
      .addCase(
        addTrainTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{ travelers: Traveler[]; trainId: string }>
        ) => {
          const { travelers, trainId } = action.payload;

          // Find the train associated with this trainId
          const train = state.trains.find(
            (t) => String(t.id) === String(trainId)
          );

          if (train) {
            // Append new travelers to the existing list
            train.travelers = [...(train.travelers || []), ...travelers];
          }
        }
      )
      // DELETE TRAIN TRAVELER
      .addCase(
        deleteTrainTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; trainId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, trainId } = action.payload;

          // Find the train
          const train = state.trains.find(
            (t) => Number(t.id) === Number(trainId)
          );

          if (train) {
            // Remove deleted traveler from the train's travelers
            train.travelers =
              train.travelers?.filter((att) => att.value !== travelerId) || [];
          }
        }
      );
  },
});

export default trainSlice.reducer;
