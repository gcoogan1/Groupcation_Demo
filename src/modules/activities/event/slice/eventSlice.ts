import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventAttachments } from "@tableTypes/eventTable.types";
import {
  fetchEventTable,
  addEventTable,
  updateEventTable,
  deleteEventTable,
  fetchEventByGroupcationId,
  addEventAttachmentsTable,
  deleteEventAttachment,
  addEventTravelersTable,
  deleteEventTraveler,
} from "../thunk/eventThunk";

type Traveler = {
  value: number;
  label: string;
};

interface Event {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  eventName: string;
  eventLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  eventOrganizer: string;
  ticketType: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: EventAttachments[];
  notes?: string;
}

interface EventState {
  events: Event[];
}

const initialState: EventState = {
  events: [],
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH EVENT
      .addCase(
        fetchEventTable.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          action.payload.forEach((newEvent) => {
            // Check if the event already exists in state
            const index = state.events.findIndex(
              (event) => event.id === newEvent.id
            );
            // Update existing event data
            // findIndex() (used above) returns -1 if no match is found.
            // If the flight exists in the array, index will be 0 or greater.
            if (index !== -1) {
              state.events[index] = newEvent;
            } else {
              // Add new event to state
              state.events.push(newEvent);
            }
          });
        }
      )
      // ADD NEW EVENT
      .addCase(
        addEventTable.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.events.push(action.payload);
        }
      )
      // UPDATE EVENT
      .addCase(
        updateEventTable.fulfilled,
        (state, action: PayloadAction<Event>) => {
          const updatedEvent = action.payload;
          // Find the event in the state
          const index = state.events.findIndex(
            (event) => event.id === updatedEvent.id
          );
          // Replace with updated data
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
        }
      )
      // DELETE EVENT
      .addCase(
        deleteEventTable.fulfilled,
        (state, action: PayloadAction<string>) => {
          // Remove event based in id
          state.events = state.events.filter(
            (event) => event.id !== action.payload
          );
        }
      )
      // FETCH EVENT BY GROUPCATION ID
      .addCase(
        fetchEventByGroupcationId.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          // Replace current event state with fetched events for the groupcation
          state.events = action.payload;
        }
      )
      // ADD EVENT ATTACHMENT
      .addCase(
        addEventAttachmentsTable.fulfilled,
        (state, action: PayloadAction<EventAttachments[]>) => {
          action.payload.forEach((attachment) => {
            // Find the event associated with this attachment
            const event = state.events.find(
              (t) => Number(t.id) === attachment.eventId
            );
            // Append the new attachment(s) to the existing list
            if (event) {
              event.attachments = [...(event.attachments || []), attachment];
            }
          });
        }
      )
      // DELETE EVENT ATTACHMENT
      .addCase(
        deleteEventAttachment.fulfilled,
        (
          state,
          action: PayloadAction<
            { attachmentId: number | string; eventId: string } | undefined
          >
        ) => {
          // Avoids breaking if payload is undefined
          if (!action.payload) return;

          const { attachmentId, eventId } = action.payload;

          // Find the event
          const event = state.events.find(
            (t) => Number(t.id) === Number(eventId)
          );
          if (event) {
            // Remove deleted attachment from the event's attachments
            event.attachments =
              event.attachments?.filter((att) => att.id !== attachmentId) || [];
          }
        }
      )
      // ADD EVENT TRAVELERS
      .addCase(
        addEventTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{ travelers: Traveler[]; eventId: string }>
        ) => {
          const { travelers, eventId } = action.payload;

          // Find the event associated with this eventId
          const event = state.events.find(
            (t) => String(t.id) === String(eventId)
          );

          if (event) {
            // Append new travelers to the existing list
            event.travelers = [...(event.travelers || []), ...travelers];
          }
        }
      )
      // DELETE EVENT TRAVELER
      .addCase(
        deleteEventTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; eventId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, eventId } = action.payload;

          // Find the event
          const event = state.events.find(
            (t) => Number(t.id) === Number(eventId)
          );

          if (event) {
            // Remove deleted traveler from the event's travelers
            event.travelers =
              event.travelers?.filter((att) => att.value !== travelerId) || [];
          }
        }
      );
  },
});

export default eventSlice.reducer;
