import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchWalkingRouteByGroupcationId,
  fetchWalkingRouteTable,
  addWalkingTable,
  updateWalkingTable,
  deleteWalkingTable,
  addWalkingTravelersTable,
  deleteWalkingTraveler,
} from "../thunk/walkingThunk";

type Traveler = {
  value: number;
  label: string;
};

interface WalkingRoute {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  walkDuration: string;
  departureLocation: string;
  departureDate: string;
  departureTime: string;
  arrivalLocation: string;
  notes?: string;
  travelers?: Traveler[];
}

interface WalkingRouteState {
  walkingRoutes: WalkingRoute[];
}

const initialState: WalkingRouteState = {
  walkingRoutes: [],
};

const walkingRouteSlice = createSlice({
  name: "walkingRoute",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all by groupcationId
      .addCase(fetchWalkingRouteByGroupcationId.fulfilled, (state, action) => {
        state.walkingRoutes = action.payload;
      })

      // Fetch single by ID
      .addCase(fetchWalkingRouteTable.fulfilled, (state, action) => {
        const newWalking = action.payload[0];
        const existingIndex = state.walkingRoutes.findIndex(
          (d) => d.id === newWalking.id
        );

        if (existingIndex !== -1) {
          state.walkingRoutes[existingIndex] = newWalking;
        } else {
          state.walkingRoutes.push(newWalking);
        }
      })

      // Add
      .addCase(addWalkingTable.fulfilled, (state, action) => {
        state.walkingRoutes.push(action.payload);
      })

      // Update
      .addCase(updateWalkingTable.fulfilled, (state, action) => {
        const index = state.walkingRoutes.findIndex(
          (walking) => walking.id === action.payload.id
        );
        if (index !== -1) {
          state.walkingRoutes[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteWalkingTable.fulfilled, (state, action) => {
        state.walkingRoutes = state.walkingRoutes.filter(
          (walking) => walking.id !== action.payload
        );
      })
        // ADD WALKING TRAVELERS
      .addCase(
        addWalkingTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{ travelers: Traveler[]; walkingId: string }>
        ) => {
          const { travelers, walkingId } = action.payload;

          // Find the walking associated with this walkingId
          const walking = state.walkingRoutes.find(
            (t) => String(t.id) === String(walkingId)
          );

          if (walking) {
            // Append new travelers to the existing list
            walking.travelers = [...(walking.travelers || []), ...travelers];
          }
        }
      )
       // DELETE WALKING TRAVELER
      .addCase(
        deleteWalkingTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; walkingId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, walkingId } = action.payload;

          // Find the walking
          const walking = state.walkingRoutes.find(
            (t) => Number(t.id) === Number(walkingId)
          );

          if (walking) {
            // Remove deleted traveler from the walking's travelers
            walking.travelers =
              walking.travelers?.filter((att) => att.value !== travelerId) ||
              [];
          }
        }
      );
  },
});

export default walkingRouteSlice.reducer;
