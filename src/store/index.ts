/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from '@reduxjs/toolkit';
import trainReducer from "../modules/activities/train/slice/trainSlice"

const serializableMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type.startsWith("train/")) {
    const updatedAction = {
      ...action,
      payload: {
        ...action.payload,
        departureDate: action.payload.departureDate
          ? new Date(action.payload.departureDate).toISOString()
          : null,
        arrivalDate: action.payload.arrivalDate
          ? new Date(action.payload.arrivalDate).toISOString()
          : null,
      },
    };
    return next(updatedAction);
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    train: trainReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(serializableMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;