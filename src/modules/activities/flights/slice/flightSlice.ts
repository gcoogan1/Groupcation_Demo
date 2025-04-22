import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FlightAttachments } from "@tableTypes/flightTable.types";
import {
  addFlightAttachmentsTable,
  addFlightTable,
  addFlightTravelersTable,
  deleteFlightAttachment,
  deleteFlightTable,
  deleteFlightTraveler,
  fetchFlightByGroupcationId,
  fetchFlightTable,
  updateFlightTable,
} from "../thunk/flightThunk";

type Traveler = {
  value: number;
  label: string;
};

type FlightClass = "economy" | "premiumEconomy" | "business" | "firstClass";

interface Flight {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  airline: string;
  flightClass: FlightClass;
  flightNumber?: string;
  departureAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalDate: string;
  arrivalTime: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: FlightAttachments[];
  notes?: string;
}

interface FlightState {
  flights: Flight[];
}

const initialState: FlightState = {
  flights: [],
};

const flightSlice = createSlice({
  name: "flight",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH FLIGHT
      .addCase(
        fetchFlightTable.fulfilled,
        (state, action: PayloadAction<Flight[]>) => {
          action.payload.forEach((newFlight) => {
            // Check if the flight already exists in state
            const index = state.flights.findIndex(
              (flight) => flight.id === newFlight.id
            );
            // Update existing flight data
            if (index !== -1) {
              state.flights[index] = newFlight;
            } else {
              // Add new flight to state
              state.flights.push(newFlight);
            }
          });
        }
      )
      // ADD NEW FLIGHT
      .addCase(
        addFlightTable.fulfilled,
        (state, action: PayloadAction<Flight>) => {
          state.flights.push(action.payload);
        }
      )
      // UPDATE FLIGHT
      .addCase(
        updateFlightTable.fulfilled,
        (state, action: PayloadAction<Flight>) => {
          const updatedFlight = action.payload;
          // Find the flight in the state
          const index = state.flights.findIndex(
            (flight) => flight.id === updatedFlight.id
          );
          // Replace with updated data
          // findIndex() returns -1 if no match is found.
          if (index !== -1) {
            state.flights[index] = updatedFlight;
          }
        }
      )
      // DELETE FLIGHT
      .addCase(
        deleteFlightTable.fulfilled,
        (state, action: PayloadAction<string>) => {
          // Remove flight based in id
          state.flights = state.flights.filter(
            (flight) => flight.id !== action.payload
          );
        }
      )
      // FETCH FLIGHT BY GROUPCATION ID
      .addCase(
        fetchFlightByGroupcationId.fulfilled,
        (state, action: PayloadAction<Flight[]>) => {
          // Replace current flight state with fetched flights for the groupcation
          state.flights = action.payload;
        }
      )
      // ADD FLIGHT ATTACHMENT
      .addCase(
        addFlightAttachmentsTable.fulfilled,
        (state, action: PayloadAction<FlightAttachments[]>) => {
          action.payload.forEach((attachment) => {
            // Find the flight associated with this attachment
            const flight = state.flights.find(
              (t) => Number(t.id) === attachment.flightId
            );
            // Append the new attachment(s) to the existing list
            if (flight) {
              flight.attachments = [...(flight.attachments || []), attachment];
            }
          });
        }
      )
      // DELETE FLIGHT ATTACHMENT
      .addCase(
        deleteFlightAttachment.fulfilled,
        (
          state,
          action: PayloadAction<
            { attachmentId: number | string; flightId: string } | undefined
          >
        ) => {
          // Avoids breaking if payload is undefined
          if (!action.payload) return;

          const { attachmentId, flightId } = action.payload;

          // Find the flight
          const flight = state.flights.find(
            (t) => Number(t.id) === Number(flightId)
          );
          if (flight) {
            // Remove deleted attachment from the flight's attachments
            flight.attachments =
              flight.attachments?.filter((att) => att.id !== attachmentId) ||
              [];
          }
        }
      )
      // ADD FLIGHT TRAVELERS
      .addCase(
        addFlightTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{ travelers: Traveler[]; flightId: string }>
        ) => {
          const { travelers, flightId } = action.payload;

          // Find the flight associated with this flightId
          const flight = state.flights.find(
            (t) => String(t.id) === String(flightId)
          );

          if (flight) {
            // Append new travelers to the existing list
            flight.travelers = [...(flight.travelers || []), ...travelers];
          }
        }
      )
      // DELETE FLIGHT TRAVELER
      .addCase(
        deleteFlightTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; flightId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, flightId } = action.payload;

          // Find the flight
          const flight = state.flights.find(
            (t) => Number(t.id) === Number(flightId)
          );

          if (flight) {
            // Remove deleted traveler from the flight's travelers
            flight.travelers =
              flight.travelers?.filter((att) => att.value !== travelerId) || [];
          }
        }
      );
  },
});

export default flightSlice.reducer;
