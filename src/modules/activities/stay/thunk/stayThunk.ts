/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";
import { supabase } from "@lib/supabase";
import { StayTable, StayAttachments } from "@tableTypes/stayTable.types";

// ----> NOTES <---- //
// STAY STATE: camalCASE
// STAY DB TABLE: snake_case

type Traveler = {
  value: number;
  label: string;
};

interface Stay {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  railwayLine: string;
  class: string;
  departureStation: string;
  departureDate: string;
  departureTime: string;
  arrivalStation: string;
  arrivalDate: string;
  arrivalTime: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: StayAttachments[];
  notes?: string;
}

// --- STAY TABLE --- //
export const fetchStayByGroupcationId = createAsyncThunk(
  "stay/fetchStaysByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH STAY TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: stays, error: stayError } = await supabase
      .from("stays")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (stayError) throw new Error(stayError.message);
    if (!stays || stays.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON STAY ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("stay_travelers")
      .select("*")
      .in(
        "stay_id",
        stays.map((stay) => stay.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON STAY ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("stay_attachments")
      .select("*")
      .in(
        "stay_id",
        stays.map((stay) => stay.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: STAY + TRAVELERS + ATTACHMENTS --- //
    const result = stays.map((stay) => {
      // Get travelers for the current stay
      const stayTravelers = travelers.filter(
        (traveler) => traveler.stay_id === stay.id
      );

      // Get attachments for the current stay
      const stayAttachments = attachments.filter(
        (attachment) => attachment.stay_id === stay.id
      );

      // Combine the stay data with its associated travelers and attachments
      const sanitizedStay = replaceNullWithUndefined(stay);
      const convertedDataDates = convertFormDatesToString(sanitizedStay);
      const combinedStayData = transformToCamelCase({
        ...convertedDataDates,
        id: stay.id.toString(),
        travelers: stayTravelers,
        attachments: stayAttachments,
      });

      return combinedStayData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchStayTable = createAsyncThunk(
  "stay/fetchStays",
  async (stayId: string) => {
    // --- STEP 1: FETCH STAY TABLE (based on stayId) --- //
    const { data: stayData, error: stayError } = await supabase
      .from("stays")
      .select("*")
      .eq("id", stayId);

    // IF ERROR OR NO DATA
    if (stayError) throw new Error(stayError.message);
    if (!stayData || stayData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = stayData.map((stay) => {
      const sanitizedStay = replaceNullWithUndefined(stay);
      const convertedDataDates = convertFormDatesToString(sanitizedStay);
      return transformToCamelCase({
        ...convertedDataDates,
        id: stay.id.toString(),
      });
    });

    // --- STEP 3: FETCH STAY ATTACHMENTS (stay attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("stay_attachments")
      .select("*")
      .eq("stay_id", stayId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH STAY TRAVELERS (stay travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("stay_travelers")
      .select("*")
      .eq("stay_id", stayId);

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

    // --- STEP 5: COMBINE STAY, STAY ATTACHMENTS, & STAY TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((stay) => ({
      ...stay,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addStayTable = createAsyncThunk(
  "stay/addStay",
  async (
    {
      stay,
      files,
      travelers,
    }: {
      stay: StayTable;
      files?: StayAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH STAY TABLE (for storage in supabase) --- ///
    const convertedStayData = transformToSnakeCase(stay);

    // --- STEP 2: ADD STAY TABLE --- ///
    const { data, error } = await supabase
      .from("stays")
      .insert([convertedStayData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB STAY TABLE DATA --- //
    /* 
      We grab the stay table data because the 
      ID of the stay table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newStay = {
      ...data[0],
      id: data[0].id.toString(),
    } as Stay;

    // STEP 4: CONVERT STAY TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newStay))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the stayId/addedBy from stay table (see above)
      to the addStayAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addStayAttachmentsTable({
          files,
          stayId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addStayTravelersTable({ travelers, stayId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateStayTable = createAsyncThunk(
  "stay/updateStay",
  async (
    {
      stay,
      files,
      selectedTravelers,
    }: {
      stay: StayTable;
      files?: StayAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR STAY TABLE UPDATE --- //
    const { id, attachments, travelers, ...stayData } =
      transformToSnakeCase(stay);

    // --- STEP 2: UPDATE AND RETURN STAY TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("stays")
      .update(stayData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newStay = {
      ...data[0],
      id: data[0].id.toString(),
    } as Stay;

    const convertedDataDates = convertFormDatesToString(newStay);
    const sanitizedStay = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedStay);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("stay_attachments")
        .select("id, file_name")
        .eq("stay_id", id);

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
            deleteStayAttachment({ attachmentId, stayId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("stay_travelers")
        .select("traveler_id")
        .eq("stay_id", id);

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

    console.log("DELETE TRAVELERS:", travelersToDelete);

    // --- STEP 8: DELETE TRAVELERS --- //
    if (travelersToDelete.length > 0) {
      await Promise.all(
        travelersToDelete.map(async (travelerId) => {
          await dispatch(
            deleteStayTraveler({ travelerId, stayId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addStayAttachmentsTable({
          files,
          stayId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addStayTravelersTable({
          travelers: selectedTravelers,
          stayId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED STAY DATA --- //
    return convertedReturnData;
  }
);

export const deleteStayTable = createAsyncThunk(
  "stay/deleteStay",
  async (stayId: string) => {
    // --- STEP 1: DELETE STAY TRAVELERS ASSOCIATED WITH THIS STAY ID --- //
    const { error: travelerError } = await supabase
      .from("stay_travelers")
      .delete()
      .eq("stay_id", stayId);

    if (travelerError) {
      throw new Error(`Error deleting travelers: ${travelerError.message}`);
    }

    // --- STEP 2: DELETE STAY ATTACHMENTS ASSOCIATED WITH THIS STAY ID --- //
    const { error: attachmentError } = await supabase
      .from("stay_attachments")
      .delete()
      .eq("stay_id", stayId);

    if (attachmentError) {
      throw new Error(`Error deleting attachments: ${attachmentError.message}`);
    }

    // --- STEP 3: DELETE THE STAY TABLE --- //
    const { error } = await supabase.from("stays").delete().eq("id", stayId);

    if (error) {
      throw new Error(`Error deleting stay: ${error.message}`);
    }

    // --- STEP 4: RETURN STAY ID TO STATE --- //
    return stayId;
  }
);

// --- STAY ATTACHMENTS --- //
export const addStayAttachmentsTable = createAsyncThunk(
  "stay/addStayAttachment",
  async ({
    files,
    stayId,
    addedBy,
  }: {
    files: StayAttachments[];
    stayId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON STAY ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("stay_attachments")
        .select("file_name")
        .eq("stay_id", stayId);

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
        files found from the stay attachments table
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

          // CREATE A FILE PATH (add stay-attachments from more definition)
          const filePath = `stay-attachments/${stayId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR STAY ATTACHMENTS TABLE UPDATE
          return {
            stayId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH STAY ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the stay attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO STAY ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("stay_attachments")
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
      console.error("Error adding stay attachments:", error);
      throw error;
    }
  }
);

export const deleteStayAttachment = createAsyncThunk(
  "stay/deleteStayAttachment",
  async ({
    attachmentId,
    stayId,
  }: {
    attachmentId: number | string;
    stayId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM STAY ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("stay_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, stayId };
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

      // --- STEP 4: DELETE FILE FROM STAY ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("stay_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("stay_id", stayId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, stayId };
    } catch (error) {
      console.error("Error deleting stay attachment:", error);
      throw error;
    }
  }
);

// --- STAY TRAVELERS --- //
export const addStayTravelersTable = createAsyncThunk(
  "stay/addStayTravelers",
  async ({ travelers, stayId }: { travelers: Traveler[]; stayId: string }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY STAY ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("stay_travelers")
        .select("traveler_id")
        .eq("stay_id", stayId);

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
        return { travelers: [], stayId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR STAY TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          stay_id: stayId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO STAY TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("stay_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.log("ERROR:", error);

      console.log("Sucess:", data);

      // --- STEP 5: RETURN TRAVELERS & STAY ID TO STATE --- ///
      return { travelers, stayId };
    } catch (error) {
      console.error("Error adding stay travelers:", error);
      throw error;
    }
  }
);

export const deleteStayTraveler = createAsyncThunk(
  "stay/deleteStayTraveler",
  async ({
    travelerId,
    stayId,
  }: {
    travelerId: number | string;
    stayId: string;
  }) => {
    try {
      // --- STEP 1: DETELE STAY TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("stay_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("stay_id", stayId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, stayId };
    } catch (error) {
      console.error("Error deleting stay traveler:", error);
      throw error;
    }
  }
);
