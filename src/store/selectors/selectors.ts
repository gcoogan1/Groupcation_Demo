import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { convertUsersToTravelers, convertUsersToTravelersFilter } from "@utils/conversionFunctions/conversionFunctions";

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

// Memoized selector for rentals
export const selectRentals = createSelector(
  [(state: RootState) => state.rental.rentals],
  (rentals) => [...rentals]
);

// Memoized selector for rental (found by rental id)
export const selectRentalById = createSelector(
  [(state: RootState) => state.rental.rentals, (_, rentalId?: string) => rentalId],
  (rentals, rentalId) => (rentalId ? rentals.find((rental) => rental.id === rentalId) : undefined)
);

// Memoized selector for events
export const selectEvents = createSelector(
  [(state: RootState) => state.event.events],
  (events) => [...events]
);

// Memoized selector for event (found by event id)
export const selectEventById = createSelector(
  [(state: RootState) => state.event.events, (_, eventId?: string) => eventId],
  (events, eventId) => (eventId ? events.find((event) => event.id === eventId) : undefined)
);

// Memoized selector for restaurants
export const selectRestaurants = createSelector(
  [(state: RootState) => state.restaurant.restaurants],
  (restaurants) => [...restaurants]
);

// Memoized selector for restaurant (found by restaurant id)
export const selectRestaurantById = createSelector(
  [(state: RootState) => state.restaurant.restaurants, (_, restaurantId?: string) => restaurantId],
  (restaurants, restaurantId) => (restaurantId ? restaurants.find((restaurant) => restaurant.id === restaurantId) : undefined)
);

// Memoized selector for celebrations
export const selectCelebrations = createSelector(
  [(state: RootState) => state.celebration.celebrations],
  (celebrations) => [...celebrations]
);

// Memoized selector for celebration (found by celebration id)
export const selectCelebrationById = createSelector(
  [(state: RootState) => state.celebration.celebrations, (_, celebrationId?: string) => celebrationId],
  (celebrations, celebrationId) => (celebrationId ? celebrations.find((celebration) => celebration.id === celebrationId) : undefined)
);

// Memoized selector for driving routes
export const selectDrivingRoutes = createSelector(
  [(state: RootState) => state.drivingRoute.drivingRoutes],
  (drivingRoutes) => [...drivingRoutes]
);

// Memoized selector for driving route (found by driving id)
export const selectDrivingRouteById = createSelector(
  [(state: RootState) => state.drivingRoute.drivingRoutes, (_, drivingId?: string) => drivingId],
  (drivingRoutes, drivingId) => (drivingId ? drivingRoutes.find((drivingRoute) => drivingRoute.id === drivingId) : undefined)
);

// Memoized selector for walking routes
export const selecWalkingRoutes = createSelector(
  [(state: RootState) => state.walkingRoute.walkingRoutes],
  (walkingRoutes) => [...walkingRoutes]
);

// Memoized selector for walking route (found by walking id)
export const selectWalkingRouteById = createSelector(
  [(state: RootState) => state.walkingRoute.walkingRoutes, (_, walkingId?: string) => walkingId],
  (walkingRoutes, walkingId) => (walkingId ? walkingRoutes.find((walkingRoute) => walkingRoute.id === walkingId) : undefined)
);

// Memoized selector for  notes
export const selectNotes = createSelector(
  [(state: RootState) => state.note.notes],
  (notes) => [...notes]
);

// Memoized selector for note (found note id)
export const selectNoteById = createSelector(
  [(state: RootState) => state.note.notes, (_, noteId?: string) => noteId],
  (notes, noteId) => (noteId ? notes.find((note) => note.id === noteId) : undefined)
);