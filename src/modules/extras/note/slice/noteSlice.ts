import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Note {
	id: string;
	// groupcationId: string;
	// createdBy: string;
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
	reducers: {
		addNote: (state, action: PayloadAction<Note>) => {
			state.notes.push(action.payload);
		},
		updateNote: (state, action: PayloadAction<Note>) => {
			const index = state.notes.findIndex(
				(note) => note.id === action.payload.id
			);
			if (index !== -1) {
				state.notes[index] = action.payload;
			}
		},

		deleteNote: (state, action: PayloadAction<string>) => {
			state.notes = state.notes.filter(
				(note) => note.id !== action.payload
			);
		},
	},
});

export const { addNote, updateNote, deleteNote } = noteSlice.actions;
export default noteSlice.reducer;
