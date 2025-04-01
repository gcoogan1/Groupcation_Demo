import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { convertUsersToTravelers } from "../../utils/conversionFunctions/conversionFunctions";

// MEMORIZED SELECTOR FUNCTIONS TO PREVENT RE-RENDERS WHEN FETCHING STATE

// Memoized selector for getting a specific groupcation by ID
export const selectGroupcationById = createSelector(
  [(state: RootState) => state.groupcation.groupcations, (_, groupcationId?: number) => groupcationId],
  (groupcations, groupcationId) => groupcationId ? groupcations.find((g) => g.id === groupcationId) : undefined
);

//  Memoized selector for converted users
export const selectConvertedUsers = createSelector(
  (state: RootState) => state.user.users,
  (users) => convertUsersToTravelers(users) // Runs only when `users` change
);

// Memoized selector for trains
export const selectTrains = createSelector(
  [(state: RootState) => state.train.trains],
  (trains) => [...trains] // Creates a new array reference only if `trains` changes
);

// Memoized selector for train (found by train id)
export const selectTrainById = createSelector(
  [(state: RootState) => state.train.trains, (_, trainId?: string) => trainId],
  (trains, trainId) => (trainId ? trains.find((train) => train.id === trainId) : undefined)
);
