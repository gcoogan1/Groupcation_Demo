import { createSlice } from "@reduxjs/toolkit";
import {
  addDrivingTable,
  deleteDrivingTable,
  fetchDrivingRouteByGroupcationId,
  fetchDrivingRouteTable,
  updateDrivingTable,
} from "../thunk/drivingThunk";

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
      });
  },
});

export default drivingRouteSlice.reducer;
