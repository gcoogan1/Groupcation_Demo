/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";
import { supabase } from "@lib/supabase";
import { FlightTable, FlightAttachments } from "@tableTypes/flightTable.types";

// ----> NOTES <---- //
// FLIGHT STATE: camalCASE
// FLIGHT DB TABLE: snake_case

type Traveler = {
  value: number;
  label: string;
};

interface Flight {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  railwayLine: string;
  class: string;
  flightDuration: string;
  departureStation: string;
  departureDate: string;
  departureTime: string;
  arrivalStation: string;
  arrivalDate: string;
  arrivalTime: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: FlightAttachments[];
  notes?: string;
}

// --- FLIGHT TABLE --- //
export const fetchFlightByGroupcationId = createAsyncThunk(
  "flight/fetchFlightsByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH FLIGHT TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: flights, error: flightError } = await supabase
      .from("flights")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (flightError) throw new Error(flightError.message);
    if (!flights || flights.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON FLIGHT ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("flight_travelers")
      .select("*")
      .in(
        "flight_id",
        flights.map((flight) => flight.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON FLIGHT ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("flight_attachments")
      .select("*")
      .in(
        "flight_id",
        flights.map((flight) => flight.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: FLIGHT + TRAVELERS + ATTACHMENTS --- //
    const result = flights.map((flight) => {
      // Get travelers for the current flight
      const flightTravelers = travelers.filter(
        (traveler) => traveler.flight_id === flight.id
      );

      // Get attachments for the current flight
      const flightAttachments = attachments.filter(
        (attachment) => attachment.flight_id === flight.id
      );

      // Combine the flight data with its associated travelers and attachments
      const sanitizedFlight = replaceNullWithUndefined(flight);
      const convertedDataDates = convertFormDatesToString(sanitizedFlight);
      const combinedFlightData = transformToCamelCase({
        ...convertedDataDates,
        id: flight.id.toString(),
        travelers: flightTravelers,
        attachments: flightAttachments,
      });

      return combinedFlightData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchFlightTable = createAsyncThunk(
  "flight/fetchFlights",
  async (flightId: string) => {
    // --- STEP 1: FETCH FLIGHT TABLE (based on flightId) --- //
    const { data: flightData, error: flightError } = await supabase
      .from("flights")
      .select("*")
      .eq("id", flightId);

    // IF ERROR OR NO DATA
    if (flightError) throw new Error(flightError.message);
    if (!flightData || flightData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = flightData.map((flight) => {
      const sanitizedFlight = replaceNullWithUndefined(flight);
      const convertedDataDates = convertFormDatesToString(sanitizedFlight);
      return transformToCamelCase({
        ...convertedDataDates,
        id: flight.id.toString(),
      });
    });

    // --- STEP 3: FETCH FLIGHT ATTACHMENTS (flight attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("flight_attachments")
      .select("*")
      .eq("flight_id", flightId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH FLIGHT TRAVELERS (flight travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("flight_travelers")
      .select("*")
      .eq("flight_id", flightId);

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

    // --- STEP 5: COMBINE FLIGHT, FLIGHT ATTACHMENTS, & FLIGHT TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((flight) => ({
      ...flight,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addFlightTable = createAsyncThunk(
  "flight/addFlight",
  async (
    {
      flight,
      files,
      travelers,
    }: {
      flight: FlightTable;
      files?: FlightAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH FLIGHT TABLE (for storage in supabase) --- ///
    const convertedFlightData = transformToSnakeCase(flight);

    // --- STEP 2: ADD FLIGHT TABLE --- ///
    const { data, error } = await supabase
      .from("flights")
      .insert([convertedFlightData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB FLIGHT TABLE DATA --- //
    /* 
      We grab the flight table data because the 
      ID of the flight table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newFlight = {
      ...data[0],
      id: data[0].id.toString(),
    } as Flight;

    // STEP 4: CONVERT FLIGHT TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newFlight))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the flightId/addedBy from flight table (see above)
      to the addFlightAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addFlightAttachmentsTable({
          files,
          flightId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addFlightTravelersTable({ travelers, flightId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateFlightTable = createAsyncThunk(
  "flight/updateFlight",
  async (
    {
      flight,
      files,
      selectedTravelers,
    }: {
      flight: FlightTable;
      files?: FlightAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR FLIGHT TABLE UPDATE --- //
    const { id, attachments, travelers, ...flightData } =
      transformToSnakeCase(flight);

    // --- STEP 2: UPDATE AND RETURN FLIGHT TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("flights")
      .update(flightData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newFlight = {
      ...data[0],
      id: data[0].id.toString(),
    } as Flight;

    const convertedDataDates = convertFormDatesToString(newFlight);
    const sanitizedFlight = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedFlight);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("flight_attachments")
        .select("id, file_name")
        .eq("flight_id", id);

    // IF ERROR
    if (fetchAttachmentError)
      throw new Error(
        `Failed to fetch existing attachments: ${fetchAttachmentError.message}`
      );

    // --- STEP 4: IDENTIFY ATTACHMENTS TO DELETE --- //
    // Compare attachments passed from form to those in database
    const passedFileNames = new Set(files?.map((file) => file.fileName) || []);

    const attachmentsToDelete = existingAttachments
      .filter((attachment) => !passedFileNames.has(attachment.file_name))
      .map((attachment) => attachment.id);

    // --- STEP 5: DELETE ATTACHMENTS  --- //
    // Delete those arrachments that are not needed
    if (attachmentsToDelete.length > 0) {
      await Promise.all(
        attachmentsToDelete.map(async (attachmentId: string | number) => {
          await dispatch(
            deleteFlightAttachment({ attachmentId, flightId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("flight_travelers")
        .select("traveler_id")
        .eq("flight_id", id);

    // IF ERROR
    if (fetchTravelerError)
      console.error("Error fetching existing travelers:", fetchTravelerError);

    const existingTravelerIds = new Set(
      existingTravelers?.map((t) => t.traveler_id) || []
    );
    const selectedTravelerIds = new Set(
      selectedTravelers?.map((t) => t.value) || []
    );

    // --- STEP 7: IDENTIFY TRAVELERS TO DELETE --- //
    // Find travelers that exist in DB but were removed from the form
    const travelersToDelete = [...existingTravelerIds].filter(
      (travelerId) => !selectedTravelerIds.has(travelerId)
    );

    // --- STEP 8: DELETE TRAVELERS --- //
    if (travelersToDelete.length > 0) {
      await Promise.all(
        travelersToDelete.map(async (travelerId) => {
          await dispatch(
            deleteFlightTraveler({ travelerId, flightId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addFlightAttachmentsTable({
          files,
          flightId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addFlightTravelersTable({
          travelers: selectedTravelers,
          flightId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED FLIGHT DATA --- //
    return convertedReturnData;
  }
);

export const deleteFlightTable = createAsyncThunk(
  "flight/deleteFlight",
  async (flightId: string) => {
    // --- STEP 1: DELETE FLIGHT TRAVELERS ASSOCIATED WITH THIS FLIGHT ID --- //
    const { error: travelerError } = await supabase
      .from("flight_travelers")
      .delete()
      .eq("flight_id", flightId);

    if (travelerError) {
      throw new Error(`Error deleting travelers: ${travelerError.message}`);
    }

    // --- STEP 2: DELETE FLIGHT ATTACHMENTS ASSOCIATED WITH THIS FLIGHT ID --- //
    const { error: attachmentError } = await supabase
      .from("flight_attachments")
      .delete()
      .eq("flight_id", flightId);

    if (attachmentError) {
      throw new Error(`Error deleting attachments: ${attachmentError.message}`);
    }

    // --- STEP 3: DELETE THE FLIGHT TABLE --- //
    const { error } = await supabase
      .from("flights")
      .delete()
      .eq("id", flightId);

    if (error) {
      throw new Error(`Error deleting flight: ${error.message}`);
    }

    // --- STEP 4: RETURN FLIGHT ID TO STATE --- //
    return flightId;
  }
);

// --- FLIGHT ATTACHMENTS --- //
export const addFlightAttachmentsTable = createAsyncThunk(
  "flight/addFlightAttachment",
  async ({
    files,
    flightId,
    addedBy,
  }: {
    files: FlightAttachments[];
    flightId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON FLIGHT ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("flight_attachments")
        .select("file_name")
        .eq("flight_id", flightId);

      // IF ERROR
      if (fetchError)
        throw new Error(
          `Failed to fetch existing attachments: ${fetchError.message}`
        );

      // --- STEP 2: GET EXISTING FILE NAMES --- //
      const existingFileNames = new Set(
        existingAttachments?.map((att) => att.file_name)
      );

      // -- STEP 3: FILTER OUT FILES THAT HAVE ALREADY BEEN UPLOADED -- //
      /*
        This compare the the new files passed in with the existing 
        files found from the flight attachments table
      */
      const newFiles = files.filter(
        (file) => !existingFileNames.has(file.fileName)
      );

      // NO NEW FILES
      if (newFiles.length === 0) {
        console.log("No new files to upload");
        return [];
      }

      // --- STEP 4: MAP THRU EACH FILE TO CREATE A FILE PATH FOR SUPABASE STORAGE ---//
      const uploadedFiles = await Promise.all(
        newFiles.map(async (file) => {
          // REPLACE ANY WHITE SPACE WITH AN UNDERSCORE TO PREVENT MISMATCH
          const sanitizedFileName = file.fileName.trim().replace(/\s+/g, "_");

          // CREATE A FILE PATH (add flight-attachments from more definition)
          const filePath = `flight-attachments/${flightId}/${Date.now()}_${sanitizedFileName}`;

          // UPLOAD TO SUPABASE STORAGE
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("attachments")
              .upload(filePath, file.file!);

          if (uploadError)
            throw new Error(`Upload failed: ${uploadError.message}`);

          // GET PUBLIC URL
          const { data: urlData } = supabase.storage
            .from("attachments")
            .getPublicUrl(filePath);
          const fileUrl = urlData.publicUrl;

          // CONVERT STRUCTURE TO ALLOW FOR FLIGHT ATTACHMENTS TABLE UPDATE
          return {
            flightId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH FLIGHT ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the flight attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO FLIGHT ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("flight_attachments")
        .insert(convertedUploadedFiles)
        .select();

      // IF ERROR
      if (error) throw new Error(error.message);

      // --- STEP 6: RETURN DATA WITH CORRECT CONVERSION TO STATE --- //
      return data.map((attachment, index) => ({
        ...transformToCamelCase(replaceNullWithUndefined(attachment)),
        file: uploadedFiles[index].file, // Only add file here for state (not DB)
      }));
    } catch (error) {
      console.error("Error adding flight attachments:", error);
      throw error;
    }
  }
);

export const deleteFlightAttachment = createAsyncThunk(
  "flight/deleteFlightAttachment",
  async ({
    attachmentId,
    flightId,
  }: {
    attachmentId: number | string;
    flightId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM FLIGHT ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("flight_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, flightId };
      }

      // --- STEP 2: EXTRACT FILE PATH FROM URL --- //
      const filePath = attachment.file_url.split("/attachments/")[1];

      // --- STEP 3: DELETE FILE FROM STORAGE --- //
      const { error: storageError } = await supabase.storage
        .from("attachments")
        .remove([filePath]);

      // IF ERROR
      if (storageError)
        throw new Error(
          `Error deleting file from storage: ${storageError.message}`
        );

      // --- STEP 4: DELETE FILE FROM FLIGHT ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("flight_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("flight_id", flightId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, flightId };
    } catch (error) {
      console.error("Error deleting flight attachment:", error);
      throw error;
    }
  }
);

// --- FLIGHT TRAVELERS --- //
export const addFlightTravelersTable = createAsyncThunk(
  "flight/addFlightTravelers",
  async ({
    travelers,
    flightId,
  }: {
    travelers: Traveler[];
    flightId: string;
  }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY FLIGHT ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("flight_travelers")
        .select("traveler_id")
        .eq("flight_id", flightId);

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
        return { travelers: [], flightId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR FLIGHT TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          flight_id: flightId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO FLIGHT TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("flight_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.log("ERROR:", error);

      console.log("Sucess:", data);

      // --- STEP 5: RETURN TRAVELERS & FLIGHT ID TO STATE --- ///
      return { travelers, flightId };
    } catch (error) {
      console.error("Error adding flight travelers:", error);
      throw error;
    }
  }
);

export const deleteFlightTraveler = createAsyncThunk(
  "flight/deleteFlightTraveler",
  async ({
    travelerId,
    flightId,
  }: {
    travelerId: number | string;
    flightId: string;
  }) => {
    try {
      // --- STEP 1: DETELE FLIGHT TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("flight_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("flight_id", flightId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, flightId };
    } catch (error) {
      console.error("Error deleting flight traveler:", error);
      throw error;
    }
  }
);
