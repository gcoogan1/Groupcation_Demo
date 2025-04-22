import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";
import { supabase } from "@lib/supabase";
import {
  EventTable,
  EventAttachments,
} from "@tableTypes/eventTable.types";

// ----> NOTES <---- //
// EVENT STATE: camalCASE
// EVENT DB TABLE: snake_case

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
  ticketType: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: EventAttachments[];
  notes?: string;
}

// --- EVENT TABLE --- //
export const fetchEventByGroupcationId = createAsyncThunk(
  "event/fetchEventsByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH EVENT TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: events, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (eventError) throw new Error(eventError.message);
    if (!events || events.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON EVENT ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("event_travelers")
      .select("*")
      .in(
        "event_id",
        events.map((event) => event.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON EVENT ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("event_attachments")
      .select("*")
      .in(
        "event_id",
        events.map((event) => event.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: EVENT + TRAVELERS + ATTACHMENTS --- //
    const result = events.map((event) => {
      // Get travelers for the current event
      const eventTravelers = travelers.filter(
        (traveler) => traveler.event_id === event.id
      );

      // Get attachments for the current event
      const eventAttachments = attachments.filter(
        (attachment) => attachment.event_id === event.id
      );

      // Combine the event data with its associated travelers and attachments
      const sanitizedEvent = replaceNullWithUndefined(event);
      const convertedDataDates = convertFormDatesToString(sanitizedEvent);
      const combinedEventData = transformToCamelCase({
        ...convertedDataDates,
        id: event.id.toString(),
        travelers: eventTravelers, // Add travelers to the event data
        attachments: eventAttachments, // Add attachments to the event data
      });

      return combinedEventData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchEventTable = createAsyncThunk(
  "event/fetchEvents",
  async (eventId: string) => {
    // --- STEP 1: FETCH EVENT TABLE (based on eventId) --- //
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId);

    // IF ERROR OR NO DATA
    if (eventError) throw new Error(eventError.message);
    if (!eventData || eventData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = eventData.map((event) => {
      const sanitizedEvent = replaceNullWithUndefined(event);
      const convertedDataDates = convertFormDatesToString(sanitizedEvent);
      return transformToCamelCase({
        ...convertedDataDates,
        id: event.id.toString(),
      });
    });

    // --- STEP 3: FETCH EVENT ATTACHMENTS (event attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("event_attachments")
      .select("*")
      .eq("event_id", eventId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH EVENT TRAVELERS (event travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("event_travelers")
      .select("*")
      .eq("event_id", eventId);

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

    // --- STEP 5: COMBINE EVENT, EVENT ATTACHMENTS, & EVENT TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((event) => ({
      ...event,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addEventTable = createAsyncThunk(
  "event/addEvent",
  async (
    {
      event,
      files,
      travelers,
    }: {
      event: EventTable;
      files?: EventAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH EVENT TABLE (for storage in supabase) --- ///
    const convertedEventData = transformToSnakeCase(event);

    // --- STEP 2: ADD EVENT TABLE --- ///
    const { data, error } = await supabase
      .from("events")
      .insert([convertedEventData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB EVENT TABLE DATA --- //
    /* 
      We grab the event table data because the 
      ID of the event table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newEvent = {
      ...data[0],
      id: data[0].id.toString(),
    } as Event;

    // STEP 4: CONVERT EVENT TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newEvent))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the eventId/addedBy from event table (see above)
      to the addEventAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addEventAttachmentsTable({
          files,
          eventId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addEventTravelersTable({ travelers, eventId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateEventTable = createAsyncThunk(
  "event/updateEvent",
  async (
    {
      event,
      files,
      selectedTravelers,
    }: {
      event: EventTable;
      files?: EventAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR EVENT TABLE UPDATE --- //
    const { id, attachments, travelers, ...eventData } =
      transformToSnakeCase(event);

    // --- STEP 2: UPDATE AND RETURN EVENT TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newEvent = {
      ...data[0],
      id: data[0].id.toString(),
    } as Event;

    const convertedDataDates = convertFormDatesToString(newEvent);

    const sanitizedEvent = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedEvent);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("event_attachments")
        .select("id, file_name")
        .eq("event_id", id);

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
            deleteEventAttachment({ attachmentId, eventId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("event_travelers")
        .select("traveler_id")
        .eq("event_id", id);

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
            deleteEventTraveler({ travelerId, eventId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addEventAttachmentsTable({
          files,
          eventId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addEventTravelersTable({
          travelers: selectedTravelers,
          eventId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED EVENT DATA --- //
    return convertedReturnData;
  }
);

export const deleteEventTable = createAsyncThunk(
  "event/deleteEvent",
  async (eventId: string) => {
    // --- STEP 1: DETELE EVENT TABLE BASED ON EVENT ID --- //
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) {
      throw new Error(error.message);
    }

    // --- STEP 2: PASS EVENT ID TO STATE (so state can delete event) ---//
    return eventId;
  }
);

// --- EVENT ATTACHMENTS --- //
export const addEventAttachmentsTable = createAsyncThunk(
  "event/addEventAttachment",
  async ({
    files,
    eventId,
    addedBy,
  }: {
    files: EventAttachments[];
    eventId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON EVENT ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("event_attachments")
        .select("file_name")
        .eq("event_id", eventId);

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
        files found from the event attachments table
      */
      const newFiles = files.filter(
        (file) => !existingFileNames.has(file.fileName)
      );

      // NO NEW FILES
      if (newFiles.length === 0) {
        return [];
      }

      // --- STEP 4: MAP THRU EACH FILE TO CREATE A FILE PATH FOR SUPABASE STORAGE ---//
      const uploadedFiles = await Promise.all(
        newFiles.map(async (file) => {
          // REPLACE ANY WHITE SPACE WITH AN UNDERSCORE TO PREVENT MISMATCH
          const sanitizedFileName = file.fileName.trim().replace(/\s+/g, "_");

          // CREATE A FILE PATH (add event-attachments from more definition)
          const filePath = `event-attachments/${eventId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR EVENT ATTACHMENTS TABLE UPDATE
          return {
            eventId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH EVENT ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the event attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO EVENT ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("event_attachments")
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
      console.error("Error adding event attachments:", error);
      throw error;
    }
  }
);

export const deleteEventAttachment = createAsyncThunk(
  "event/deleteEventAttachment",
  async ({
    attachmentId,
    eventId,
  }: {
    attachmentId: number | string;
    eventId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM EVENT ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("event_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, eventId };
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

      // --- STEP 4: DELETE FILE FROM EVENT ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("event_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("event_id", eventId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, eventId };
    } catch (error) {
      console.error("Error deleting event attachment:", error);
      throw error;
    }
  }
);

// --- EVENT TRAVELERS --- //
export const addEventTravelersTable = createAsyncThunk(
  "event/addEventTravelers",
  async ({
    travelers,
    eventId,
  }: {
    travelers: Traveler[];
    eventId: string;
  }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY EVENT ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("event_travelers")
        .select("traveler_id")
        .eq("event_id", eventId);

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
        return { travelers: [], eventId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR EVENT TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          event_id: eventId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO EVENT TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("event_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.error("ERROR:", error);

      // --- STEP 5: RETURN TRAVELERS & EVENT ID TO STATE --- ///
      return { travelers, eventId };
    } catch (error) {
      console.error("Error adding event travelers:", error);
      throw error;
    }
  }
);

export const deleteEventTraveler = createAsyncThunk(
  "event/deleteEventTraveler",
  async ({
    travelerId,
    eventId,
  }: {
    travelerId: number | string;
    eventId: string;
  }) => {
    try {
      // --- STEP 1: DETELE EVENT TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("event_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("event_id", eventId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, eventId };
    } catch (error) {
      console.error("Error deleting event traveler:", error);
      throw error;
    }
  }
);
