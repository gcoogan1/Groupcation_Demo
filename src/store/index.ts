import { combineReducers, configureStore } from "@reduxjs/toolkit";
import trainReducer from "@modules/activities/train/slice/trainSlice";
import stayReducer from "@modules/activities/stay/slice/staySlice";
import flightReducer from "@modules/activities/flights/slice/flightSlice";
import busReducer from "@modules/activities/bus/slice/busSlice";
import boatReducer from "@modules/activities/boat/slice/boatSlice";
import rentalReducer from "@modules/activities/rental/slice/rentalSlice";
import restaurantReducer from "@modules/activities/restaurant/slice/restaurantSlice";
import eventReducer from "@modules/activities/event/slice/eventSlice";
import celebrationReducer from "@modules/activities/celebration/slice/celebrationSlice";
import walkingRouteReducer from "@modules/routes/walking/slice/walkingRouteSlice";
import drivingRouteReducer from "@modules/routes/driving/slice/drivingRouteSlice";
import noteReducer from "@modules/extras/note/slice/noteSlice";
import linkedTripReducer from "@modules/extras/linkedTrip/slice/linkedTripSlice";
import groupcationReducer from "./slice/groupcationSlice";
import userReducer from "./slice/usersSlice";

// Combine Reducers
const rootReducer = combineReducers({
  train: trainReducer,
  stay: stayReducer,
  flight: flightReducer,
  bus: busReducer,
  boat: boatReducer,
  rental: rentalReducer,
  restaurant: restaurantReducer,
  event: eventReducer,
  celebration: celebrationReducer,
  walkingRoute: walkingRouteReducer,
  drivingRoute: drivingRouteReducer,
  note: noteReducer,
  linkedTrip: linkedTripReducer,
  groupcation: groupcationReducer,
  user: userReducer,
});

// Configure Store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Add any ignored actions if needed (e.g., if you have special actions in your reducers)
        ],
        ignoredPaths: [
          // Add any ignored paths if needed (e.g., if you have non-serializable data like file attachments)
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
