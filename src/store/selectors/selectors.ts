import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { convertUsersToTravelers, convertUsersToTravelersFilter } from "../../utils/conversionFunctions/conversionFunctions";

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

export const selectTableUsers = createSelector(
  (state: RootState) => state.user.users,
  (users) => users
);

//  Memoized selector for converted users for filter
export const selectConvertedUsersForFilters = createSelector(
  (state: RootState) => state.user.users,
  (users) => convertUsersToTravelersFilter(users) 
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

// Memoized selector for flights
export const selectFlights = createSelector(
  [(state: RootState) => state.flight.flights],
  (flights) => [...flights] // Creates a new array reference only if `flights` changes
);

// Memoized selector for flight (found by flight id)
export const selectFlightById = createSelector(
  [(state: RootState) => state.flight.flights, (_, flightId?: string) => flightId],
  (flights, flightId) => (flightId ? flights.find((flight) => flight.id === flightId) : undefined)
);

// Memoized selector for stays
export const selectStays = createSelector(
  [(state: RootState) => state.stay.stays],
  (stays) => [...stays]
);

// Memoized selector for stay (found by stay id)
export const selectStayById = createSelector(
  [(state: RootState) => state.stay.stays, (_, stayId?: string) => stayId],
  (stays, stayId) => (stayId ? stays.find((stay) => stay.id === stayId) : undefined)
);

// Memoized selector for buses
export const selectBuses = createSelector(
  [(state: RootState) => state.bus.buses],
  (buses) => [...buses]
);

// Memoized selector for bus (found by bus id)
export const selectBusById = createSelector(
  [(state: RootState) => state.bus.buses, (_, busId?: string) => busId],
  (buses, busId) => (busId ? buses.find((bus) => bus.id === busId) : undefined)
);

// Memoized selector for boats
export const selectBoats = createSelector(
  [(state: RootState) => state.boat.boats],
  (boats) => [...boats]
);

// Memoized selector for boat (found by boat id)
export const selectBoatById = createSelector(
  [(state: RootState) => state.boat.boats, (_, boatId?: string) => boatId],
  (boats, boatId) => (boatId ? boats.find((boat) => boat.id === boatId) : undefined)
);
