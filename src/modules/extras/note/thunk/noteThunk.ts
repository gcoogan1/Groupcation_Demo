import {
  AsyncThunkAction,
  createAsyncThunk,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
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

type Traveler = {
  value: number;
  label: string;
};

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
  travelers?: Traveler[];
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

    // --- STEP 2: FETCH TRAVELER DATA BASED ON NOTE ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("note_travelers")
      .select("*")
      .in(
        "note_id",
        note.map((n) => n.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: CONVERT DATA --- //
    const result = note.map((noteRoute) => {
      // Get travelers for the current note
      const noteTravelers = travelers.filter(
        (traveler) => traveler.note_id === noteRoute.id
      );
      const sanitizedNote = replaceNullWithUndefined(noteRoute);
      const convertedDataDates = convertFormDatesToString(sanitizedNote);
      const combinedNoteData = transformToCamelCase({
        ...convertedDataDates,
        id: noteRoute.id.toString(),
        travelers: noteTravelers,
      });

      return combinedNoteData;
    });

    // --- STEP 4: RETURN COMBINED DATA TO STATE --- //
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

    // --- STEP 4: FETCH NOTE TRAVELERS (note travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("note_travelers")
      .select("*")
      .eq("note_id", noteId);

    // IF ERROR
    if (travelerError)
      console.warn("Error fetching travelers:", travelerError.message);

    // Convert travelers table data to match state
    const convertedTravelers =
      travelerData &&
      travelerData.map((traveler) => {
        return {
          label: traveler.traveler_full_name,
          value: traveler.traveler_id,
        };
      });

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = noteRouteData.map((note) => {
      const sanitizedNote = replaceNullWithUndefined(note);
      const convertedDataDates = convertFormDatesToString(sanitizedNote);
      return transformToCamelCase({
        ...convertedDataDates,
        id: note.id.toString(),
        travelers: convertedTravelers ? convertedTravelers : [],
      });
    });

    // --- STEP 5: RETURN NOTE TABLE DATA FOR STATE UPDATE --- ///
    return returnData;
  }
);

export const addNoteTable = createAsyncThunk(
  "note/addNote",
  async (
    { note, travelers }: { note: NoteTable; travelers?: Traveler[] },
    { dispatch }
  ) => {
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

    if (travelers && travelers.length > 0) {
      await dispatch(
        addNoteTravelersTable({ travelers, noteId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 5: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateNoteTable = createAsyncThunk(
  "note/updateNote",
  async (
    {
      note,
      selectedTravelers,
    }: { note: NoteTable; selectedTravelers?: Traveler[] },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR NOTE TABLE UPDATE --- //
    const { id, travelers, ...noteRouteData } = transformToSnakeCase(note);

    // --- STEP 2: UPDATE AND RETURN NOTE TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("notes")
      .update(noteRouteData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("note_travelers")
        .select("traveler_id")
        .eq("note_id", id);

    // IF ERROR
    if (fetchTravelerError)
      console.error("Error fetching existing travelers:", fetchTravelerError);

    const existingTravelerIds = new Set(
      existingTravelers?.map((t) => t.traveler_id) || []
    );
    const selectedTravelerIds = new Set(
      selectedTravelers?.map((t) => t.value) || []
    );

    console.log("selected travlers:", selectedTravelers);
    

    // --- STEP 4: IDENTIFY TRAVELERS TO DELETE --- //
    // Find travelers that exist in DB but were removed from the form
    const travelersToDelete = [...existingTravelerIds].filter(
      (travelerId) => !selectedTravelerIds.has(travelerId)
    );

    // --- STEP 5: DELETE TRAVELERS --- //
    if (travelersToDelete.length > 0) {
      await Promise.all(
        travelersToDelete.map(async (travelerId) => {
          await dispatch(
            deleteNoteTraveler({ travelerId, noteId: id })
          ).unwrap();
        })
      );
    }

    // CONVERT FOR STATE UPDATE
    const newNote = {
      ...data[0],
      id: data[0].id.toString(),
    } as Note;

    const convertedDataDates = convertFormDatesToString(newNote);

    const sanitizedNote = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedNote);
    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addNoteTravelersTable({
          travelers: selectedTravelers,
          noteId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED NOTE DATA --- //
    return convertedReturnData;
  }
);

export const deleteNoteTable = createAsyncThunk(
  "note/deleteNote",
  async (noteId: string) => {
    // --- STEP 1: DELETE NOTE TRAVELERS ASSOCIATED WITH THIS NOTE ID --- //
    const { error: travelerError } = await supabase
      .from("note_travelers")
      .delete()
      .eq("note_id", noteId);

    if (travelerError) {
      throw new Error(`Error deleting travelers: ${travelerError.message}`);
    }

    // --- STEP 2: DELETE NOTE TABLE BASED ON NOTE ID --- //
    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    if (error) {
      throw new Error(error.message);
    }

    // --- STEP 3: PASS NOTE ID TO STATE (so state can delete note) ---//
    return noteId;
  }
);

// --- NOTE TRAVELERS --- //
export const addNoteTravelersTable = createAsyncThunk(
  "note/addNoteTravelers",
  async ({ travelers, noteId }: { travelers: Traveler[]; noteId: string }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY NOTE ID --- //
      console.log("travelers:", travelers);
      
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("note_travelers")
        .select("traveler_id")
        .eq("note_id", noteId);

      // IF ERROR
      if (fetchError) console.error("Error fetching travelers:", fetchError);

      // -- STEP 2: FILTER OUT TRAVELERS THAT HAVE ALREADY BEEN ADDED -- //
      // GET EXISITING TRAVELER IDS
      const existingTravelerIds = new Set(
        existingTravelers?.map((t) => t.traveler_id)
      );

      // FILTER OUT REPEATING TRAVELERS
      const newTravelers = travelers.filter(
        (traveler) => !existingTravelerIds.has(traveler.value)
      );

      // IF NO NEW TRAVELERS
      if (newTravelers.length === 0) {
        console.log("No new travelers to add.");
        return { travelers: [], noteId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR NOTE TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          note_id: noteId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO NOTE TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("note_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.log("ERROR:", error);

      console.log("Sucess:", data);

      // --- STEP 5: RETURN TRAVELERS & NOTE ID TO STATE --- ///
      return { travelers, noteId };
    } catch (error) {
      console.error("Error adding note travelers:", error);
      throw error;
    }
  }
);

export const deleteNoteTraveler = createAsyncThunk(
  "note/deleteNoteTraveler",
  async ({
    travelerId,
    noteId,
  }: {
    travelerId: number | string;
    noteId: string;
  }) => {
    try {
      // --- STEP 1: DETELE NOTE TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("note_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("note_id", noteId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, noteId };
    } catch (error) {
      console.error("Error deleting note traveler:", error);
      throw error;
    }
  }
);
