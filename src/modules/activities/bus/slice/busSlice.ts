import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusAttachments } from "../../../../types/busTable.types";
import {
  addBusAttachmentsTable,
  addBusTable,
  addBusTravelersTable,
  deleteBusAttachment,
  deleteBusTable,
  deleteBusTraveler,
  fetchBusByGroupcationId,
  fetchBusTable,
  updateBusTable,
} from "../thunk/busThunk";

type Traveler = {
  value: number;
  label: string;
};

interface Bus {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  busRoute: string;
  busClass: string;
  departureBusStop: string;
  departureDate: string;
  departureTime: string;
  arrivalBusStop: string;
  arrivalDate: string;
  arrivalTime: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: BusAttachments[];
  notes?: string;
}

interface BusState {
  buses: Bus[];
}

const initialState: BusState = {
  buses: [],
};

const busSlice = createSlice({
  name: "Bus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH BUS
      .addCase(
        fetchBusTable.fulfilled,
        (state, action: PayloadAction<Bus[]>) => {
          action.payload.forEach((newBus) => {
            // Check if the bus already exists in state
            const index = state.buses.findIndex((bus) => bus.id === newBus.id);
            // Update existing bus data
            // findIndex() (used above) returns -1 if no match is found.
            // If the flight exists in the array, index will be 0 or greater.
            if (index !== -1) {
              state.buses[index] = newBus;
            } else {
              // Add new bus to state
              state.buses.push(newBus);
            }
          });
        }
      )
      // ADD NEW BUS
      .addCase(addBusTable.fulfilled, (state, action: PayloadAction<Bus>) => {
        state.buses.push(action.payload);
      })
      // UPDATE BUS
      .addCase(
        updateBusTable.fulfilled,
        (state, action: PayloadAction<Bus>) => {
          const updatedBus = action.payload;
          // Find the bus in the state
          const index = state.buses.findIndex(
            (bus) => bus.id === updatedBus.id
          );
          // Replace with updated data
          if (index !== -1) {
            state.buses[index] = updatedBus;
          }
        }
      )
      // DELETE BUS
      .addCase(
        deleteBusTable.fulfilled,
        (state, action: PayloadAction<string>) => {
          // Remove bus based in id
          state.buses = state.buses.filter((bus) => bus.id !== action.payload);
        }
      )
      // FETCH BUS BY GROUPCATION ID
      .addCase(
        fetchBusByGroupcationId.fulfilled,
        (state, action: PayloadAction<Bus[]>) => {
          // Replace current bus state with fetched buses for the groupcation
          state.buses = action.payload;
        }
      )
      // ADD BUS ATTACHMENT
      .addCase(
        addBusAttachmentsTable.fulfilled,
        (state, action: PayloadAction<BusAttachments[]>) => {
          action.payload.forEach((attachment) => {
            // Find the bus associated with this attachment
            const bus = state.buses.find(
              (t) => Number(t.id) === attachment.busId
            );
            // Append the new attachment(s) to the existing list
            if (bus) {
              bus.attachments = [...(bus.attachments || []), attachment];
            }
          });
        }
      )
      // DELETE BUS ATTACHMENT
      .addCase(
        deleteBusAttachment.fulfilled,
        (
          state,
          action: PayloadAction<
            { attachmentId: number | string; busId: string } | undefined
          >
        ) => {
          // Avoids breaking if payload is undefined
          if (!action.payload) return;

          const { attachmentId, busId } = action.payload;

          // Find the bus
          const bus = state.buses.find((t) => Number(t.id) === Number(busId));
          if (bus) {
            // Remove deleted attachment from the bus's attachments
            bus.attachments =
              bus.attachments?.filter((att) => att.id !== attachmentId) || [];
          }
        }
      )
      // ADD BUS TRAVELERS
      .addCase(
        addBusTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{ travelers: Traveler[]; busId: string }>
        ) => {
          const { travelers, busId } = action.payload;

          // Find the bus associated with this busId
          const bus = state.buses.find((t) => String(t.id) === String(busId));

          if (bus) {
            // Append new travelers to the existing list
            bus.travelers = [...(bus.travelers || []), ...travelers];
          }
        }
      )
      // DELETE BUS TRAVELER
      .addCase(
        deleteBusTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; busId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, busId } = action.payload;

          // Find the bus
          const bus = state.buses.find((t) => Number(t.id) === Number(busId));

          if (bus) {
            // Remove deleted traveler from the bus's travelers
            bus.travelers =
              bus.travelers?.filter((att) => att.value !== travelerId) || [];
          }
        }
      );
  },
});

export default busSlice.reducer;
