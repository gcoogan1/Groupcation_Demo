import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addDrivingTable,
  addDrivingTravelersTable,
  deleteDrivingTable,
  deleteDrivingTraveler,
  fetchDrivingRouteByGroupcationId,
  fetchDrivingRouteTable,
  updateDrivingTable,
} from "../thunk/drivingThunk";

type Traveler = {
  value: number;
  label: string;
};

interface DrivingRoute {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  driveDuration: string;
  departureLocation: string;
  departureDate: string;
  departureTime: string;
  arrivalLocation: string;
  arrivalDate?: string;
  notes?: string;
  travelers?: Traveler[];
}

interface DrivingRouteState {
  drivingRoutes: DrivingRoute[];
}

const initialState: DrivingRouteState = {
  drivingRoutes: [],
};

const drivingRouteSlice = createSlice({
  name: "drivingRoute",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all by groupcationId
      .addCase(fetchDrivingRouteByGroupcationId.fulfilled, (state, action) => {
        state.drivingRoutes = action.payload;
      })

      // Fetch single by ID
      .addCase(fetchDrivingRouteTable.fulfilled, (state, action) => {
        const newDriving = action.payload[0];
        const existingIndex = state.drivingRoutes.findIndex(
          (d) => d.id === newDriving.id
        );

        if (existingIndex !== -1) {
          state.drivingRoutes[existingIndex] = newDriving;
        } else {
          state.drivingRoutes.push(newDriving);
        }
      })

      // Add
      .addCase(addDrivingTable.fulfilled, (state, action) => {
        state.drivingRoutes.push(action.payload);
      })

      // Update
      .addCase(updateDrivingTable.fulfilled, (state, action) => {
        const index = state.drivingRoutes.findIndex(
          (driving) => driving.id === action.payload.id
        );
        if (index !== -1) {
          state.drivingRoutes[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteDrivingTable.fulfilled, (state, action) => {
        state.drivingRoutes = state.drivingRoutes.filter(
          (driving) => driving.id !== action.payload
        );
      })
      // ADD DRIVING TRAVELERS
      .addCase(
        addDrivingTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{ travelers: Traveler[]; drivingId: string }>
        ) => {
          const { travelers, drivingId } = action.payload;

          // Find the driving associated with this drivingId
          const driving = state.drivingRoutes.find(
            (t) => String(t.id) === String(drivingId)
          );

          if (driving) {
            // Append new travelers to the existing list
            driving.travelers = [...(driving.travelers || []), ...travelers];
          }
        }
      )
      // DELETE DRIVING TRAVELER
      .addCase(
        deleteDrivingTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; drivingId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, drivingId } = action.payload;

          // Find the driving
          const driving = state.drivingRoutes.find(
            (t) => Number(t.id) === Number(drivingId)
          );

          if (driving) {
            // Remove deleted traveler from the driving's travelers
            driving.travelers =
              driving.travelers?.filter((att) => att.value !== travelerId) ||
              [];
          }
        }
      );
  },
});

export default drivingRouteSlice.reducer;
