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
  BoatTable,
  BoatAttachments,
} from "@tableTypes/boatTable.types";

// ----> NOTES <---- //
// BOAT STATE: camalCASE
// BOAT DB TABLE: snake_case

type Traveler = {
  value: number;
  label: string;
};

interface Boat {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  boatCruiseLine: string;
  boatCruiseClass: string;
  departureDock: string;
  departureDate: string;
  departureTime: string;
  arrivalDock: string;
  arrivalDate: string;
  arrivalTime: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: BoatAttachments[];
  notes?: string;
}

// --- BOAT TABLE --- //
export const fetchBoatByGroupcationId = createAsyncThunk(
  "boat/fetchBoatsByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH BOAT TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: boats, error: boatError } = await supabase
      .from("boats")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (boatError) throw new Error(boatError.message);
    if (!boats || boats.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON BOAT ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("boat_travelers")
      .select("*")
      .in(
        "boat_id",
        boats.map((boat) => boat.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON BOAT ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("boat_attachments")
      .select("*")
      .in(
        "boat_id",
        boats.map((boat) => boat.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: BOAT + TRAVELERS + ATTACHMENTS --- //
    const result = boats.map((boat) => {
      // Get travelers for the current boat
      const boatTravelers = travelers.filter(
        (traveler) => traveler.boat_id === boat.id
      );

      // Get attachments for the current boat
      const boatAttachments = attachments.filter(
        (attachment) => attachment.boat_id === boat.id
      );

      // Combine the boat data with its associated travelers and attachments
      const sanitizedBoat = replaceNullWithUndefined(boat);
      const convertedDataDates = convertFormDatesToString(sanitizedBoat);
      const combinedBoatData = transformToCamelCase({
        ...convertedDataDates,
        id: boat.id.toString(),
        travelers: boatTravelers, // Add travelers to the boat data
        attachments: boatAttachments, // Add attachments to the boat data
      });

      return combinedBoatData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchBoatTable = createAsyncThunk(
  "boat/fetchBoats",
  async (boatId: string) => {
    // --- STEP 1: FETCH BOAT TABLE (based on boatId) --- //
    const { data: boatData, error: boatError } = await supabase
      .from("boats")
      .select("*")
      .eq("id", boatId);

    // IF ERROR OR NO DATA
    if (boatError) throw new Error(boatError.message);
    if (!boatData || boatData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = boatData.map((boat) => {
      const sanitizedBoat = replaceNullWithUndefined(boat);
      const convertedDataDates = convertFormDatesToString(sanitizedBoat);
      return transformToCamelCase({
        ...convertedDataDates,
        id: boat.id.toString(),
      });
    });

    // --- STEP 3: FETCH BOAT ATTACHMENTS (boat attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("boat_attachments")
      .select("*")
      .eq("boat_id", boatId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH BOAT TRAVELERS (boat travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("boat_travelers")
      .select("*")
      .eq("boat_id", boatId);

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

    // --- STEP 5: COMBINE BOAT, BOAT ATTACHMENTS, & BOAT TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((boat) => ({
      ...boat,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addBoatTable = createAsyncThunk(
  "boat/addBoat",
  async (
    {
      boat,
      files,
      travelers,
    }: {
      boat: BoatTable;
      files?: BoatAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH BOAT TABLE (for storage in supabase) --- ///
    const convertedBoatData = transformToSnakeCase(boat);

    // --- STEP 2: ADD BOAT TABLE --- ///
    const { data, error } = await supabase
      .from("boats")
      .insert([convertedBoatData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB BOAT TABLE DATA --- //
    /* 
      We grab the boat table data because the 
      ID of the boat table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newBoat = {
      ...data[0],
      id: data[0].id.toString(),
    } as Boat;

    // STEP 4: CONVERT BOAT TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newBoat))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the boatId/addedBy from boat table (see above)
      to the addBoatAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addBoatAttachmentsTable({
          files,
          boatId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addBoatTravelersTable({ travelers, boatId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateBoatTable = createAsyncThunk(
  "boat/updateBoat",
  async (
    {
      boat,
      files,
      selectedTravelers,
    }: {
      boat: BoatTable;
      files?: BoatAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR BOAT TABLE UPDATE --- //
    const { id, attachments, travelers, ...boatData } =
      transformToSnakeCase(boat);

    // --- STEP 2: UPDATE AND RETURN BOAT TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("boats")
      .update(boatData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newBoat = {
      ...data[0],
      id: data[0].id.toString(),
    } as Boat;

    const convertedDataDates = convertFormDatesToString(newBoat);

    const sanitizedBoat = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedBoat);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("boat_attachments")
        .select("id, file_name")
        .eq("boat_id", id);

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
            deleteBoatAttachment({ attachmentId, boatId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("boat_travelers")
        .select("traveler_id")
        .eq("boat_id", id);

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
            deleteBoatTraveler({ travelerId, boatId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addBoatAttachmentsTable({
          files,
          boatId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addBoatTravelersTable({
          travelers: selectedTravelers,
          boatId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED BOAT DATA --- //
    return convertedReturnData;
  }
);

export const deleteBoatTable = createAsyncThunk(
  "boat/deleteBoat",
  async (boatId: string) => {
        // --- STEP 1: DELETE BOAT TRAVELERS ASSOCIATED WITH THIS BOAT ID --- //
        const { error: travelerError } = await supabase
        .from("boat_travelers")
        .delete()
        .eq("boat_id", boatId);
  
      if (travelerError) {
        throw new Error(`Error deleting travelers: ${travelerError.message}`);
      }
  
      // --- STEP 2: DELETE BOAT ATTACHMENTS ASSOCIATED WITH THIS BOAT ID --- //
      const { error: attachmentError } = await supabase
        .from("boat_attachments")
        .delete()
        .eq("boat_id", boatId);
  
      if (attachmentError) {
        throw new Error(`Error deleting attachments: ${attachmentError.message}`);
      }
  
      // --- STEP 3: DELETE THE BOAT TABLE --- //
      const { error } = await supabase.from("boats").delete().eq("id", boatId);
  
      if (error) {
        throw new Error(`Error deleting boat: ${error.message}`);
      }
  
      // --- STEP 4: RETURN BOAT ID TO STATE --- //
      return boatId;
  }
);

// --- BOAT ATTACHMENTS --- //
export const addBoatAttachmentsTable = createAsyncThunk(
  "boat/addBoatAttachment",
  async ({
    files,
    boatId,
    addedBy,
  }: {
    files: BoatAttachments[];
    boatId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON BOAT ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("boat_attachments")
        .select("file_name")
        .eq("boat_id", boatId);

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
        files found from the boat attachments table
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

          // CREATE A FILE PATH (add boat-attachments from more definition)
          const filePath = `boat-attachments/${boatId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR BOAT ATTACHMENTS TABLE UPDATE
          return {
            boatId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH BOAT ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the boat attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO BOAT ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("boat_attachments")
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
      console.error("Error adding boat attachments:", error);
      throw error;
    }
  }
);

export const deleteBoatAttachment = createAsyncThunk(
  "boat/deleteBoatAttachment",
  async ({
    attachmentId,
    boatId,
  }: {
    attachmentId: number | string;
    boatId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM BOAT ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("boat_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, boatId };
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

      // --- STEP 4: DELETE FILE FROM BOAT ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("boat_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("boat_id", boatId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, boatId };
    } catch (error) {
      console.error("Error deleting boat attachment:", error);
      throw error;
    }
  }
);

// --- BOAT TRAVELERS --- //
export const addBoatTravelersTable = createAsyncThunk(
  "boat/addBoatTravelers",
  async ({ travelers, boatId }: { travelers: Traveler[]; boatId: string }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY BOAT ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("boat_travelers")
        .select("traveler_id")
        .eq("boat_id", boatId);

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
        return { travelers: [], boatId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR BOAT TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          boat_id: boatId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO BOAT TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("boat_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.error("ERROR:", error);

      // --- STEP 5: RETURN TRAVELERS & BOAT ID TO STATE --- ///
      return { travelers, boatId };
    } catch (error) {
      console.error("Error adding boat travelers:", error);
      throw error;
    }
  }
);

export const deleteBoatTraveler = createAsyncThunk(
  "boat/deleteBoatTraveler",
  async ({
    travelerId,
    boatId,
  }: {
    travelerId: number | string;
    boatId: string;
  }) => {
    try {
      // --- STEP 1: DETELE BOAT TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("boat_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("boat_id", boatId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, boatId };
    } catch (error) {
      console.error("Error deleting boat traveler:", error);
      throw error;
    }
  }
);
