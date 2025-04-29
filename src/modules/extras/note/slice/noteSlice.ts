import { createSlice } from "@reduxjs/toolkit";
import {
  addNoteTable,
  deleteNoteTable,
  fetchNoteByGroupcationId,
  fetchNoteTable,
  updateNoteTable,
} from "../thunk/noteThunk";

interface Note {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  startDate: string;
  startTime: string;
  noteTitle: string;
  noteContent: string;
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
      });
  },
});

export default noteSlice.reducer;
