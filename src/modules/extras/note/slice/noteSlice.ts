import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addNoteTable,
  addNoteTravelersTable,
  deleteNoteTable,
  deleteNoteTraveler,
  fetchNoteByGroupcationId,
  fetchNoteTable,
  updateNoteTable,
} from "../thunk/noteThunk";

type Traveler = {
  value: number;
  label: string;
};

interface Note {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  startDate: string;
  startTime: string;
  noteTitle: string;
  noteContent: string;
  travelers?: Traveler[];
}

interface NoteState {
  notes: Note[];
}

const initialState: NoteState = {
  notes: [],
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all by groupcationId
      .addCase(fetchNoteByGroupcationId.fulfilled, (state, action) => {
        state.notes = action.payload;
      })

      // Fetch single by ID
      .addCase(fetchNoteTable.fulfilled, (state, action) => {
        const newNote = action.payload[0];
        const existingIndex = state.notes.findIndex((d) => d.id === newNote.id);

        if (existingIndex !== -1) {
          state.notes[existingIndex] = newNote;
        } else {
          state.notes.push(newNote);
        }
      })

      // Add
      .addCase(addNoteTable.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })

      // Update
      .addCase(updateNoteTable.fulfilled, (state, action) => {
        const index = state.notes.findIndex(
          (walking) => walking.id === action.payload.id
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteNoteTable.fulfilled, (state, action) => {
        state.notes = state.notes.filter(
          (walking) => walking.id !== action.payload
        );
      })
      // ADD NOTE TRAVELERS
      .addCase(
        addNoteTravelersTable.fulfilled,
        (
          state,
          action: PayloadAction<{ travelers: Traveler[]; noteId: string }>
        ) => {
          const { travelers, noteId } = action.payload;

          // Find the note associated with this noteId
          const note = state.notes.find((t) => String(t.id) === String(noteId));

          if (note) {
            // Append new travelers to the existing list
            note.travelers = [...(note.travelers || []), ...travelers];
          }
        }
      )
      // DELETE NOTE TRAVELER
      .addCase(
        deleteNoteTraveler.fulfilled,
        (
          state,
          action: PayloadAction<
            { travelerId: number | string; noteId: string } | undefined
          >
        ) => {
          if (!action.payload) return;

          const { travelerId, noteId } = action.payload;

          // Find the note
          const note = state.notes.find((t) => Number(t.id) === Number(noteId));

          if (note) {
            // Remove deleted traveler from the note's travelers
            note.travelers =
              note.travelers?.filter((att) => att.value !== travelerId) || [];
          }
        }
      );
  },
});

export default noteSlice.reducer;
