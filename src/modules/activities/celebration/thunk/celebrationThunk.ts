/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";
import { supabase } from "@lib/supabase";
import {
  CelebrationTable,
  CelebrationAttachments,
} from "@tableTypes/celebrationTable.types";

// ----> NOTES <---- //
// CELEBRATION STATE: camalCASE
// CELEBRATION DB TABLE: snake_case

type Traveler = {
  value: number;
  label: string;
};

interface Celebration {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  celebrationName: string;
  celebrationLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  ticketType: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: CelebrationAttachments[];
  notes?: string;
}

// --- CELEBRATION TABLE --- //
export const fetchCelebrationByGroupcationId = createAsyncThunk(
  "celebration/fetchCelebrationsByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH CELEBRATION TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: celebrations, error: celebrationError } = await supabase
      .from("celebrations")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (celebrationError) throw new Error(celebrationError.message);
    if (!celebrations || celebrations.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON CELEBRATION ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("celebration_travelers")
      .select("*")
      .in(
        "celebration_id",
        celebrations.map((celebration) => celebration.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON CELEBRATION ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("celebration_attachments")
      .select("*")
      .in(
        "celebration_id",
        celebrations.map((celebration) => celebration.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: CELEBRATION + TRAVELERS + ATTACHMENTS --- //
    const result = celebrations.map((celebration) => {
      // Get travelers for the current celebration
      const celebrationTravelers = travelers.filter(
        (traveler) => traveler.celebration_id === celebration.id
      );

      // Get attachments for the current celebration
      const celebrationAttachments = attachments.filter(
        (attachment) => attachment.celebration_id === celebration.id
      );

      // Combine the celebration data with its associated travelers and attachments
      const sanitizedCelebration = replaceNullWithUndefined(celebration);
      const convertedDataDates = convertFormDatesToString(sanitizedCelebration);
      const combinedCelebrationData = transformToCamelCase({
        ...convertedDataDates,
        id: celebration.id.toString(),
        travelers: celebrationTravelers, // Add travelers to the celebration data
        attachments: celebrationAttachments, // Add attachments to the celebration data
      });

      return combinedCelebrationData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchCelebrationTable = createAsyncThunk(
  "celebration/fetchCelebrations",
  async (celebrationId: string) => {
    // --- STEP 1: FETCH CELEBRATION TABLE (based on celebrationId) --- //
    const { data: celebrationData, error: celebrationError } = await supabase
      .from("celebrations")
      .select("*")
      .eq("id", celebrationId);

    // IF ERROR OR NO DATA
    if (celebrationError) throw new Error(celebrationError.message);
    if (!celebrationData || celebrationData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = celebrationData.map((celebration) => {
      const sanitizedCelebration = replaceNullWithUndefined(celebration);
      const convertedDataDates = convertFormDatesToString(sanitizedCelebration);
      return transformToCamelCase({
        ...convertedDataDates,
        id: celebration.id.toString(),
      });
    });

    // --- STEP 3: FETCH CELEBRATION ATTACHMENTS (celebration attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("celebration_attachments")
      .select("*")
      .eq("celebration_id", celebrationId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH CELEBRATION TRAVELERS (celebration travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("celebration_travelers")
      .select("*")
      .eq("celebration_id", celebrationId);

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

    // --- STEP 5: COMBINE CELEBRATION, CELEBRATION ATTACHMENTS, & CELEBRATION TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((celebration) => ({
      ...celebration,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addCelebrationTable = createAsyncThunk(
  "celebration/addCelebration",
  async (
    {
      celebration,
      files,
      travelers,
    }: {
      celebration: CelebrationTable;
      files?: CelebrationAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH CELEBRATION TABLE (for storage in supabase) --- ///
    const convertedCelebrationData = transformToSnakeCase(celebration);

    // --- STEP 2: ADD CELEBRATION TABLE --- ///
    const { data, error } = await supabase
      .from("celebrations")
      .insert([convertedCelebrationData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB CELEBRATION TABLE DATA --- //
    /* 
      We grab the celebration table data because the 
      ID of the celebration table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newCelebration = {
      ...data[0],
      id: data[0].id.toString(),
    } as Celebration;

    // STEP 4: CONVERT CELEBRATION TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newCelebration))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the celebrationId/addedBy from celebration table (see above)
      to the addCelebrationAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addCelebrationAttachmentsTable({
          files,
          celebrationId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addCelebrationTravelersTable({
          travelers,
          celebrationId: convertedData.id,
        })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateCelebrationTable = createAsyncThunk(
  "celebration/updateCelebration",
  async (
    {
      celebration,
      files,
      selectedTravelers,
    }: {
      celebration: CelebrationTable;
      files?: CelebrationAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR CELEBRATION TABLE UPDATE --- //
    const { id, attachments, travelers, ...celebrationData } =
      transformToSnakeCase(celebration);

    // --- STEP 2: UPDATE AND RETURN CELEBRATION TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("celebrations")
      .update(celebrationData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newCelebration = {
      ...data[0],
      id: data[0].id.toString(),
    } as Celebration;

    const convertedDataDates = convertFormDatesToString(newCelebration);

    const sanitizedCelebration = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedCelebration);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("celebration_attachments")
        .select("id, file_name")
        .eq("celebration_id", id);

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
            deleteCelebrationAttachment({ attachmentId, celebrationId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("celebration_travelers")
        .select("traveler_id")
        .eq("celebration_id", id);

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
            deleteCelebrationTraveler({ travelerId, celebrationId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addCelebrationAttachmentsTable({
          files,
          celebrationId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addCelebrationTravelersTable({
          travelers: selectedTravelers,
          celebrationId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED CELEBRATION DATA --- //
    return convertedReturnData;
  }
);

export const deleteCelebrationTable = createAsyncThunk(
  "celebration/deleteCelebration",
  async (celebrationId: string) => {
        // --- STEP 1: DELETE CELEBRATION TRAVELERS ASSOCIATED WITH THIS CELEBRATION ID --- //
        const { error: travelerError } = await supabase
        .from("celebration_travelers")
        .delete()
        .eq("celebration_id", celebrationId);
  
      if (travelerError) {
        throw new Error(`Error deleting travelers: ${travelerError.message}`);
      }
  
      // --- STEP 2: DELETE CELEBRATION ATTACHMENTS ASSOCIATED WITH THIS CELEBRATION ID --- //
      const { error: attachmentError } = await supabase
        .from("celebration_attachments")
        .delete()
        .eq("celebration_id", celebrationId);
  
      if (attachmentError) {
        throw new Error(`Error deleting attachments: ${attachmentError.message}`);
      }
  
      // --- STEP 3: DELETE THE CELEBRATION TABLE --- //
      const { error } = await supabase.from("celebrations").delete().eq("id", celebrationId);
  
      if (error) {
        throw new Error(`Error deleting celebration: ${error.message}`);
      }
  
      // --- STEP 4: RETURN CELEBRATION ID TO STATE --- //
      return celebrationId;
  }
);

// --- CELEBRATION ATTACHMENTS --- //
export const addCelebrationAttachmentsTable = createAsyncThunk(
  "celebration/addCelebrationAttachment",
  async ({
    files,
    celebrationId,
    addedBy,
  }: {
    files: CelebrationAttachments[];
    celebrationId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON CELEBRATION ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("celebration_attachments")
        .select("file_name")
        .eq("celebration_id", celebrationId);

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
        files found from the celebration attachments table
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
          // REPLACE ANY WHITE SPACE WITH AN UNDERSCORE TO PRCELEBRATION MISMATCH
          const sanitizedFileName = file.fileName.trim().replace(/\s+/g, "_");

          // CREATE A FILE PATH (add celebration-attachments from more definition)
          const filePath = `celebration-attachments/${celebrationId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR CELEBRATION ATTACHMENTS TABLE UPDATE
          return {
            celebrationId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH CELEBRATION ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the celebration attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO CELEBRATION ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("celebration_attachments")
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
      console.error("Error adding celebration attachments:", error);
      throw error;
    }
  }
);

export const deleteCelebrationAttachment = createAsyncThunk(
  "celebration/deleteCelebrationAttachment",
  async ({
    attachmentId,
    celebrationId,
  }: {
    attachmentId: number | string;
    celebrationId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM CELEBRATION ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("celebration_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, celebrationId };
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

      // --- STEP 4: DELETE FILE FROM CELEBRATION ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("celebration_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("celebration_id", celebrationId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, celebrationId };
    } catch (error) {
      console.error("Error deleting celebration attachment:", error);
      throw error;
    }
  }
);

// --- CELEBRATION TRAVELERS --- //
export const addCelebrationTravelersTable = createAsyncThunk(
  "celebration/addCelebrationTravelers",
  async ({
    travelers,
    celebrationId,
  }: {
    travelers: Traveler[];
    celebrationId: string;
  }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY CELEBRATION ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("celebration_travelers")
        .select("traveler_id")
        .eq("celebration_id", celebrationId);

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
        return { travelers: [], celebrationId }; // Return early to prcelebration unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR CELEBRATION TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          celebration_id: celebrationId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO CELEBRATION TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("celebration_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.error("ERROR:", error);

      // --- STEP 5: RETURN TRAVELERS & CELEBRATION ID TO STATE --- ///
      return { travelers, celebrationId };
    } catch (error) {
      console.error("Error adding celebration travelers:", error);
      throw error;
    }
  }
);

export const deleteCelebrationTraveler = createAsyncThunk(
  "celebration/deleteCelebrationTraveler",
  async ({
    travelerId,
    celebrationId,
  }: {
    travelerId: number | string;
    celebrationId: string;
  }) => {
    try {
      // --- STEP 1: DETELE CELEBRATION TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("celebration_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("celebration_id", celebrationId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, celebrationId };
    } catch (error) {
      console.error("Error deleting celebration traveler:", error);
      throw error;
    }
  }
);
