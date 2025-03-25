import { configureStore } from '@reduxjs/toolkit';
import trainReducer from "../modules/activities/train/slice/trainSlice"
import stayReducer from "../modules/activities/stay/slice/staySlice";
import flightReducer from "../modules/activities/flights/slice/flightSlice";


export const store = configureStore({
  reducer: {
    train: trainReducer,
    stay: stayReducer,
    flight: flightReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;