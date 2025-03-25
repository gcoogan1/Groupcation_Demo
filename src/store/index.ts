import { configureStore } from '@reduxjs/toolkit';
import trainReducer from "../modules/activities/train/slice/trainSlice"
import stayReducer from "../modules/activities/stay/slice/staySlice";
import flightReducer from "../modules/activities/flights/slice/flightSlice";
import busReducer from "../modules/activities/bus/slice/busSlice";
import boatReducer from "../modules/activities/boat/slice/boatSlice";
import rentalReducer from "../modules/activities/rental/slice/rentalSlice";
import restaurantReducer from "../modules/activities/restaurant/slice/restaurantSlice";


export const store = configureStore({
  reducer: {
    train: trainReducer,
    stay: stayReducer,
    flight: flightReducer,
    bus: busReducer,
    boat: boatReducer,
    rental: rentalReducer,
    restaurant: restaurantReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;