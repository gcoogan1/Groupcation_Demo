import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

interface Restaurant {
	id: string;
	// groupcationId: string;
	// createdBy: string;
	restaurantName: string;
	restaurantAddress: string;
	tableType?: string;
	reservationDate: string;
	reservationTime: string;
	travelers?: Traveler[];
	cost?: string;
	attachments?: File[];
	notes?: string;
}

interface RestaurantState {
	restaurants: Restaurant[];
}

const initialState: RestaurantState = {
	restaurants: [],
};

const restaurantSlice = createSlice({
	name: "Restaurant",
	initialState,
	reducers: {
		addRestaurant: (state, action: PayloadAction<Restaurant>) => {
			state.restaurants.push(action.payload);
		},
		updateRestaurant: (state, action: PayloadAction<Restaurant>) => {
			const index = state.restaurants.findIndex(
				(restaurant) => restaurant.id === action.payload.id
			);
			if (index !== -1) {
				state.restaurants[index] = action.payload;
			}
		},

		deleteRestaurant: (state, action: PayloadAction<string>) => {
			state.restaurants = state.restaurants.filter(
				(restaurant) => restaurant.id !== action.payload
			);
		},
	},
});

export const { addRestaurant, updateRestaurant, deleteRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
