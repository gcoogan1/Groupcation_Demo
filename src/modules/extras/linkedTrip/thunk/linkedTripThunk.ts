import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";
import { supabase } from "@lib/supabase";
import {
  LinkedTripTable,
  LinkedTripAttachments,
} from "@/tableTypes/linkedTripsTable.types";

// ----> NOTES <---- //
// LINKED TRIP STATE: camalCASE
// LINKED TRIP DB TABLE: snake_case

type Traveler = {
  value: number;
  label: string;
};

interface LinkedTrip {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  linkedTripTitle: string;
  startDate: string;
  endDate: string;
  travelers?: Traveler[];
  attachments?: LinkedTripAttachments[];
}

// --- LINKED TRIP TABLE --- //
export const fetchLinkedTripByGroupcationId = createAsyncThunk(
  "linkedTrip/fetchLinkedTripsByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH LINKED TRIP TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: linkedTrips, error: linkedTripError } = await supabase
      .from("linked_trips")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (linkedTripError) throw new Error(linkedTripError.message);
    if (!linkedTrips || linkedTrips.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON LINKED TRIP ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("linked_trip_travelers")
      .select("*")
      .in(
        "linked_trip_id",
        linkedTrips.map((linkedTrip) => linkedTrip.id)
      );

    console.log("linked trip:", travelers);

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON LINKED TRIP ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("linked_trip_attachments")
      .select("*")
      .in(
        "linked_trip_id",
        linkedTrips.map((linkedTrip) => linkedTrip.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: LINKED TRIP + TRAVELERS + ATTACHMENTS --- //
    const result = linkedTrips.map((linkedTrip) => {
      // Get travelers for the current linkedTrip
      const linkedTripTravelers = travelers.filter(
        (traveler) => traveler.linked_trip_id === linkedTrip.id
      );

      console.log("LINKED", linkedTripTravelers);

      // Get attachments for the current linkedTrip
      const linkedTripAttachments = attachments.filter(
        (attachment) => attachment.linked_trip_id === linkedTrip.id
      );

      // Combine the linkedTrip data with its associated travelers and attachments
      const sanitizedLinkedTrip = replaceNullWithUndefined(linkedTrip);
      const convertedDataDates = convertFormDatesToString(sanitizedLinkedTrip);
      const combinedLinkedTripData = transformToCamelCase({
        ...convertedDataDates,
        id: linkedTrip.id.toString(),
        travelers: linkedTripTravelers, // Add travelers to the linkedTrip data
        attachments: linkedTripAttachments, // Add attachments to the linkedTrip data
      });

      return combinedLinkedTripData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchLinkedTripTable = createAsyncThunk(
  "linkedTrip/fetchLinkedTrips",
  async (linkedTripId: string) => {
    // --- STEP 1: FETCH LINKED TRIP TABLE (based on linkedTripId) --- //
    const { data: linkedTripData, error: linkedTripError } = await supabase
      .from("linked_trips")
      .select("*")
      .eq("id", linkedTripId);

    // IF ERROR OR NO DATA
    if (linkedTripError) throw new Error(linkedTripError.message);
    if (!linkedTripData || linkedTripData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = linkedTripData.map((linkedTrip) => {
      const sanitizedLinkedTrip = replaceNullWithUndefined(linkedTrip);
      const convertedDataDates = convertFormDatesToString(sanitizedLinkedTrip);
      return transformToCamelCase({
        ...convertedDataDates,
        id: linkedTrip.id.toString(),
      });
    });

    // --- STEP 3: FETCH LINKED TRIP ATTACHMENTS (linkedTrip attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("linked_trip_attachments")
      .select("*")
      .eq("linked_trip_id", linkedTripId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH LINKED TRIP TRAVELERS (linkedTrip travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("linked_trip_travelers")
      .select("*")
      .eq("linked_trip_id", linkedTripId);

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

    // --- STEP 5: COMBINE LINKED TRIP, LINKED TRIP ATTACHMENTS, & LINKED TRIP TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((linkedTrip) => ({
      ...linkedTrip,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addLinkedTripTable = createAsyncThunk(
  "linkedTrip/addLinkedTrip",
  async (
    {
      linkedTrip,
      files,
      travelers,
    }: {
      linkedTrip: LinkedTripTable;
      files?: LinkedTripAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH LINKED TRIP TABLE (for storage in supabase) --- ///
    const convertedLinkedTripData = transformToSnakeCase(linkedTrip);

    console.log("converted:", convertedLinkedTripData);

    // --- STEP 2: ADD LINKED TRIP TABLE --- ///
    const { data, error } = await supabase
      .from("linked_trips")
      .insert([convertedLinkedTripData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB LINKED TRIP TABLE DATA --- //
    /* 
      We grab the linkedTrip table data because the 
      ID of the linkedTrip table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newLinkedTrip = {
      ...data[0],
      id: data[0].id.toString(),
    } as LinkedTrip;

    // STEP 4: CONVERT LINKED TRIP TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newLinkedTrip))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the linkedTripId/addedBy from linkedTrip table (see above)
      to the addLinkedTripAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addLinkedTripAttachmentsTable({
          files,
          linkedTripId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addLinkedTripTravelersTable({
          travelers,
          linkedTripId: convertedData.id,
        })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateLinkedTripTable = createAsyncThunk(
  "linkedTrip/updateLinkedTrip",
  async (
    {
      linkedTrip,
      files,
      selectedTravelers,
    }: {
      linkedTrip: LinkedTripTable;
      files?: LinkedTripAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR LINKED TRIP TABLE UPDATE --- //
    const { id, attachments, travelers, ...linkedTripData } =
      transformToSnakeCase(linkedTrip);

    // --- STEP 2: UPDATE AND RETURN LINKED TRIP TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("linked_trips")
      .update(linkedTripData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newLinkedTrip = {
      ...data[0],
      id: data[0].id.toString(),
    } as LinkedTrip;

    const convertedDataDates = convertFormDatesToString(newLinkedTrip);

    const sanitizedLinkedTrip = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedLinkedTrip);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("linked_trip_attachments")
        .select("id, file_name")
        .eq("linked_trip_id", id);

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
            deleteLinkedTripAttachment({ attachmentId, linkedTripId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("linked_trip_travelers")
        .select("traveler_id")
        .eq("linked_trip_id", id);

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
            deleteLinkedTripTraveler({ travelerId, linkedTripId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addLinkedTripAttachmentsTable({
          files,
          linkedTripId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addLinkedTripTravelersTable({
          travelers: selectedTravelers,
          linkedTripId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED LINKED TRIP DATA --- //
    return convertedReturnData;
  }
);

export const deleteLinkedTripTable = createAsyncThunk(
  "linkedTrip/deleteLinkedTrip",
  async (linkedTripId: string) => {
    // --- STEP 1: DELETE LINKED TRIP TRAVELERS ASSOCIATED WITH THIS ID --- //
    const { error: travelerError } = await supabase
      .from("linked_trip_travelers")
      .delete()
      .eq("linked_trip_id", linkedTripId);

    if (travelerError) {
      throw new Error(`Error deleting travelers: ${travelerError.message}`);
    }

    // --- STEP 2: DELETE LINKED TRIP ATTACHMENTS ASSOCIATED WITH THIS ID --- //
    const { error: attachmentError } = await supabase
      .from("linked_trip_attachments")
      .delete()
      .eq("linked_trip_id", linkedTripId);

    if (attachmentError) {
      throw new Error(`Error deleting attachments: ${attachmentError.message}`);
    }

    // --- STEP 3: DELETE THE LINKED TRIP TABLE --- //
    const { error } = await supabase
      .from("linked_trips")
      .delete()
      .eq("id", linkedTripId);

    if (error) {
      throw new Error(`Error deleting linked trip: ${error.message}`);
    }

    // --- STEP 4: RETURN LINKED TRIP ID TO STATE --- //
    return linkedTripId;
  }
);

// --- LINKED TRIP ATTACHMENTS --- //
export const addLinkedTripAttachmentsTable = createAsyncThunk(
  "linkedTrip/addLinkedTripAttachment",
  async ({
    files,
    linkedTripId,
    addedBy,
  }: {
    files: LinkedTripAttachments[];
    linkedTripId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON LINKED TRIP ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("linked_trip_attachments")
        .select("file_name")
        .eq("linked_trip_id", linkedTripId);

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
        files found from the linkedTrip attachments table
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

          // CREATE A FILE PATH (add linkedTrip-attachments from more definition)
          const filePath = `linkedTrip-attachments/${linkedTripId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR LINKED TRIP ATTACHMENTS TABLE UPDATE
          return {
            linkedTripId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH LINKED TRIP ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the linkedTrip attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO LINKED TRIP ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("linked_trip_attachments")
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
      console.error("Error adding linkedTrip attachments:", error);
      throw error;
    }
  }
);

export const deleteLinkedTripAttachment = createAsyncThunk(
  "linkedTrip/deleteLinkedTripAttachment",
  async ({
    attachmentId,
    linkedTripId,
  }: {
    attachmentId: number | string;
    linkedTripId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM LINKED TRIP ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("linked_trip_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, linkedTripId };
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

      // --- STEP 4: DELETE FILE FROM LINKED TRIP ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("linked_trip_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("linked_trip_id", linkedTripId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, linkedTripId };
    } catch (error) {
      console.error("Error deleting linkedTrip attachment:", error);
      throw error;
    }
  }
);

// --- LINKED TRIP TRAVELERS --- //
export const addLinkedTripTravelersTable = createAsyncThunk(
  "linkedTrip/addLinkedTripTravelers",
  async ({
    travelers,
    linkedTripId,
  }: {
    travelers: Traveler[];
    linkedTripId: string;
  }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY LINKED TRIP ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("linked_trip_travelers")
        .select("traveler_id")
        .eq("linked_trip_id", linkedTripId);

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
        return { travelers: [], linkedTripId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR LINKED TRIP TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          linked_trip_id: linkedTripId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO LINKED TRIP TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("linked_trip_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.error("ERROR:", error);

      // --- STEP 5: RETURN TRAVELERS & LINKED TRIP ID TO STATE --- ///
      return { travelers, linkedTripId };
    } catch (error) {
      console.error("Error adding linkedTrip travelers:", error);
      throw error;
    }
  }
);

export const deleteLinkedTripTraveler = createAsyncThunk(
  "linkedTrip/deleteLinkedTripTraveler",
  async ({
    travelerId,
    linkedTripId,
  }: {
    travelerId: number | string;
    linkedTripId: string;
  }) => {
    try {
      // --- STEP 1: DETELE LINKED TRIP TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("linked_trip_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("linked_trip_id", linkedTripId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, linkedTripId };
    } catch (error) {
      console.error("Error deleting linkedTrip traveler:", error);
      throw error;
    }
  }
);
