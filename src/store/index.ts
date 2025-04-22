import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
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

// FIX ERROR WITH FILE BEING ADDED TO STATE

// SAVE TO LOCAL STORAGE
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["train", "flight", "groupcation", "user"],
};

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
  user: userReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["train.attachments"], // Ignore files in persistence
        ignoredActions: ["train/addTrainAttachment/fulfilled"], // Ignore file-related actions
      },
    }),
});

// export const store = configureStore({
//   reducer: {
//     train: trainReducer,
//     stay: stayReducer,
//     flight: flightReducer,
//     bus: busReducer,
//     boat: boatReducer,
//     rental: rentalReducer,
//     restaurant: restaurantReducer,
//     event: eventReducer,
//     walkingRoute: walkingRouteReducer,
//     drivingRoute: drivingRouteReducer,
//     note: noteReducer,
//     linkedTrip: linkedTripReducer,
//     groupcation: groupcationReducer,
//     user: userReducer
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredPaths: ['train.attachments'],
//         ignoredActions: ['train/addTrainAttachment/fulfilled'],
//       },
//     }),
// });

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
