import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface WalkingRoute {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	walkDuration: string;
	notes?: string;
}

interface WalkingRouteState {
	walkingRoutes: WalkingRoute[];
}

const initialState: WalkingRouteState = {
	walkingRoutes: [],
};

const walkingRouteSlice = createSlice({
	name: "walking",
	initialState,
	reducers: {
		addWalking: (state, action: PayloadAction<WalkingRoute>) => {
			state.walkingRoutes.push(action.payload);
		},
		updateWalking: (state, action: PayloadAction<WalkingRoute>) => {
			const index = state.walkingRoutes.findIndex(
				(walking) => walking.id === action.payload.id
			);
			if (index !== -1) {
				state.walkingRoutes[index] = action.payload;
			}
		},

		deleteWalking: (state, action: PayloadAction<string>) => {
			state.walkingRoutes = state.walkingRoutes.filter(
				(walking) => walking.id !== action.payload
			);
		},
	},
});

export const { addWalking, updateWalking, deleteWalking } = walkingRouteSlice.actions;
export default walkingRouteSlice.reducer;
