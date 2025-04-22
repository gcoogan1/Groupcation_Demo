import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RestaurantAttachments } from "@tableTypes/restaurantTable.types";
import {
  fetchRestaurantTable,
  addRestaurantTable,
  updateRestaurantTable,
  deleteRestaurantTable,
  fetchRestaurantByGroupcationId,
  addRestaurantAttachmentsTable,
  deleteRestaurantAttachment,
  addRestaurantTravelersTable,
  deleteRestaurantTraveler,
} from "../thunk/restaurantThunks";

type Traveler = {
  value: number;
  label: string;
};

interface Restaurant {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  restaurantName: string;
  restaurantAddress: string;
  tableType?: string;
  reservationDate: string;
  reservationTime: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: RestaurantAttachments[];
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH RESTAURANT
      .addCase(
        fetchRestaurantTable.fulfilled,
        (state, action: PayloadAction<Restaurant[]>) => {
          action.payload.forEach((newRestaurant) => {
            // Check if the restaurant already exists in state
            const index = state.restaurants.findIndex(
              (restaurant) => restaurant.id === newRestaurant.id
            );
            // Update existing restaurant data
            // findIndex() (used above) returns -1 if no match is found.
            // If the flight exists in the array, index will be 0 or greater.
            if (index !== -1) {
              state.restaurants[index] = newRestaurant;
            } else {
              // Add new restaurant to state
              state.restaurants.push(newRestaurant);
            }
          });
        }
      )
      // ADD NEW RESTAURANT
      .addCase(
        addRestaurantTable.fulfilled,
        (state, action: PayloadAction<Restaurant>) => {
          state.restaurants.push(action.payload);
        }
      )
      // UPDATE RESTAURANT
      .addCase(
        updateRestaurantTable.fulfilled,
        (state, action: PayloadAction<Restaurant>) => {
          const updatedRestaurant = action.payload;
          // Find the restaurant in the state
          const index = state.restaurants.findIndex(
            (restaurant) => restaurant.id === updatedRestaurant.id
          );
          // Replace with updated data
          if (index !== -1) {
            state.restaurants[index] = updatedRestaurant;
          }
        }
      )
      // DELETE RESTAURANT
      .addCase(
        deleteRestaurantTable.fulfilled,
        (state, action: PayloadAction<string>) => {
          // Remove restaurant based in id
          state.restaurants = state.restaurants.filter(
            (restaurant) => restaurant.id !== action.payload
          );
        }
      )
      // FETCH RESTAURANT BY GROUPCATION ID
      .addCase(
        fetchRestaurantByGroupcationId.fulfilled,
        (state, action: PayloadAction<Restaurant[]>) => {
          // Replace current restaurant state with fetched restaurants for the groupcation
          state.restaurants = action.payload;
        }
      )
      // ADD RESTAURANT ATTACHMENT
      .addCase(
        addRestaurantAttachmentsTable.fulfilled,
        (state, action: PayloadAction<RestaurantAttachments[]>) => {
          action.payload.forEach((attachment) => {
            // Find the restaurant associated with this attachment
            const restaurant = state.restaurants.find(
              (t) => Number(t.id) === attachment.restaurantId
            );
            // Append the new attachment(s) to the existing list
            if (restaurant) {
              restaurant.attachments = [
                ...(restaurant.attachments || []),
                attachment,
              ];
            }
          });
        }
      )
      // DELETE RESTAURANT ATTACHMENT
      .addCase(
        deleteRestaurantAttachment.fulfilled,
        (
          state,
          action: PayloadAction<
            { attachmentId: number | string; restaurantId: string } | undefined
          >
        ) => {
          // Avoids breaking if payload is undefined
          if (!action.payload) return;

          const { attachmentId, restaurantId } = action.payload;

          // Find the restaurant
          const restaurant = state.restaurants.find(
            (t) => Number(t.id) === Number(restaurantId)
          );
          if (restaurant) {
            // Remove deleted attachment from the restaurant's attachments
            restaurant.attachments =
              restaurant.attachments?.filter(
                (att) => att.id !== attachmentId
              ) || [];
          }
        }
      )
      // ADD RESTAURANT TRAVELERS
      .addCase(
        addRestaurantTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{ travelers: Traveler[]; restaurantId: string }>
        ) => {
          const { travelers, restaurantId } = action.payload;

          // Find the restaurant associated with this restaurantId
          const restaurant = state.restaurants.find(
            (t) => String(t.id) === String(restaurantId)
          );

          if (restaurant) {
            // Append new travelers to the existing list
            restaurant.travelers = [
              ...(restaurant.travelers || []),
              ...travelers,
            ];
          }
        }
      )
      // DELETE RESTAURANT TRAVELER
      .addCase(
        deleteRestaurantTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; restaurantId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, restaurantId } = action.payload;

          // Find the restaurant
          const restaurant = state.restaurants.find(
            (t) => Number(t.id) === Number(restaurantId)
          );

          if (restaurant) {
            // Remove deleted traveler from the restaurant's travelers
            restaurant.travelers =
              restaurant.travelers?.filter((att) => att.value !== travelerId) ||
              [];
          }
        }
      );
  },
});

export default restaurantSlice.reducer;
