import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Traveler = {
	value: string;
	label: string;
};

interface Event {
	id: string;
	// groupcationId: string;
	// createdBy: string;
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
	attachments?: File[];
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
	reducers: {
		addEvent: (state, action: PayloadAction<Event>) => {
			state.events.push(action.payload);
		},
		updateEvent: (state, action: PayloadAction<Event>) => {
			const index = state.events.findIndex(
				(event) => event.id === action.payload.id
			);
			if (index !== -1) {
				state.events[index] = action.payload;
			}
		},

		deleteEvent: (state, action: PayloadAction<string>) => {
			state.events = state.events.filter(
				(event) => event.id !== action.payload
			);
		},
	},
});

export const { addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
