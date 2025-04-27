import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWalkingRouteByGroupcationId,
  fetchWalkingRouteTable,
  addWalkingTable,
  updateWalkingTable,
  deleteWalkingTable,
} from "../thunk/walkingThunk";

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
      });
  },
});

export default walkingRouteSlice.reducer;
