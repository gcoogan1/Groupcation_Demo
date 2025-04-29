import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";
import { supabase } from "@lib/supabase";
import { NoteTable } from "@/tableTypes/noteTable.types";

// ----> NOTES <---- //
// NOTE STATE: camalCASE
// NOTE DB TABLE: snake_case

interface Note {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  walkDuration: string;
  departureLocation: string;
  departureDate: string;
  departureTime: string;
  arrivalLocation: string;
  notes?: string;
}

// --- NOTE TABLE --- //
export const fetchNoteByGroupcationId = createAsyncThunk(
  "note/fetchNotesByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH NOTE TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (noteError) throw new Error(noteError.message);
    if (!note || note.length === 0) return [];

    // --- STEP 4: CONVERT DATA --- //
    const result = note.map((noteRoute) => {
      const sanitizedNote = replaceNullWithUndefined(noteRoute);
      const convertedDataDates = convertFormDatesToString(sanitizedNote);
      const combinedNoteData = transformToCamelCase({
        ...convertedDataDates,
        id: noteRoute.id.toString(),
      });

      return combinedNoteData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchNoteTable = createAsyncThunk(
  "note/fetchNotes",
  async (noteId: string) => {
    // --- STEP 1: FETCH NOTE TABLE (based on noteId) --- //
    const { data: noteRouteData, error: noteRouteError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId);

    // IF ERROR OR NO DATA
    if (noteRouteError) throw new Error(noteRouteError.message);
    if (!noteRouteData || noteRouteData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = noteRouteData.map((note) => {
      const sanitizedNote = replaceNullWithUndefined(note);
      const convertedDataDates = convertFormDatesToString(sanitizedNote);
      return transformToCamelCase({
        ...convertedDataDates,
        id: note.id.toString(),
      });
    });

    // --- STEP 5: RETURN NOTE TABLE DATA FOR STATE UPDATE --- ///
    return returnData;
  }
);

export const addNoteTable = createAsyncThunk(
  "note/addNote",
  async ({ note }: { note: NoteTable }) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH NOTE TABLE (for storage in supabase) --- ///
    const convertedNoteData = transformToSnakeCase(note);

    // --- STEP 2: ADD NOTE TABLE --- ///
    const { data, error } = await supabase
      .from("notes")
      .insert([convertedNoteData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB NOTE TABLE DATA --- //
    /* 
      We grab the note table data because the 
      ID of the note table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newNote = {
      ...data[0],
      id: data[0].id.toString(),
    } as Note;

    // STEP 4: CONVERT NOTE TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newNote))
    );

    // --- STEP 5: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateNoteTable = createAsyncThunk(
  "note/updateNote",
  async ({ note }: { note: NoteTable }) => {
    // --- STEP 1: TRANFORM DATA FOR NOTE TABLE UPDATE --- //
    const { id, ...noteRouteData } = transformToSnakeCase(note);

    // --- STEP 2: UPDATE AND RETURN NOTE TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("notes")
      .update(noteRouteData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newNote = {
      ...data[0],
      id: data[0].id.toString(),
    } as Note;

    const convertedDataDates = convertFormDatesToString(newNote);

    const sanitizedNote = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedNote);

    // --- STEP 3: RETURN CONVERTED NOTE DATA --- //
    return convertedReturnData;
  }
);

export const deleteNoteTable = createAsyncThunk(
  "note/deleteNote",
  async (noteId: string) => {
    // --- STEP 1: DETELE NOTE TABLE BASED ON NOTE ID --- //
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);
    if (error) {
      throw new Error(error.message);
    }

    // --- STEP 2: PASS NOTE ID TO STATE (so state can delete note) ---//
    return noteId;
  }
);
