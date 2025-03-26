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
    addDriving: (state, action: PayloadAction<DrivingRoute>) => {
      state.drivingRoutes.push(action.payload);
    },
    updateDriving: (state, action: PayloadAction<DrivingRoute>) => {
      const index = state.drivingRoutes.findIndex(
        (driving) => driving.id === action.payload.id
      );
      if (index !== -1) {
        state.drivingRoutes[index] = action.payload;
      }
    },

    deleteDriving: (state, action: PayloadAction<string>) => {
      state.drivingRoutes = state.drivingRoutes.filter(
        (driving) => driving.id !== action.payload
      );
    },
  },
});

export const { addDriving, updateDriving, deleteDriving } = drivingRouteSlice.actions;
export default drivingRouteSlice.reducer;