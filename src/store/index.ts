import { configureStore } from '@reduxjs/toolkit';
import trainReducer from "../modules/activities/train/slice/trainSlice"
import stayReducer from "../modules/activities/stay/slice/staySlice";


export const store = configureStore({
  reducer: {
    train: trainReducer,
    stay: stayReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;