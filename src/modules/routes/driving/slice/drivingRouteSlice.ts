import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface DrivingRoute {
  id: string;
  // groupcationId: string;
  // createdBy: string;
  driveDuration: string;
  notes?: string;
}

interface DrivingRouteState {
  drivingRoutes: DrivingRoute[];
}

const initialState: DrivingRouteState = {
  drivingRoutes: [],
};

const drivingRouteSlice = createSlice({
  name: "driving",
  initialState,
  reducers: {
    addWalking: (state, action: PayloadAction<DrivingRoute>) => {
      state.drivingRoutes.push(action.payload);
    },
    updateWalking: (state, action: PayloadAction<DrivingRoute>) => {
      const index = state.drivingRoutes.findIndex(
        (walking) => walking.id === action.payload.id
      );
      if (index !== -1) {
        state.drivingRoutes[index] = action.payload;
      }
    },

    deleteWalking: (state, action: PayloadAction<string>) => {
      state.drivingRoutes = state.drivingRoutes.filter(
        (walking) => walking.id !== action.payload
      );
    },
  },
});

export const { addWalking, updateWalking, deleteWalking } = drivingRouteSlice.actions;
export default drivingRouteSlice.reducer;