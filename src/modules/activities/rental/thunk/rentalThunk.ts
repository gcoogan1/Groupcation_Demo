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
  RentalTable,
  RentalAttachments,
} from "@tableTypes/rentalTable.types";

// ----> NOTES <---- //
// RENTAL STATE: camalCASE
// RENTAL DB TABLE: snake_case

type Traveler = {
  value: number;
  label: string;
};

interface Rental {
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
  attachments?: RentalAttachments[];
  notes?: string;
}

// --- RENTAL TABLE --- //
export const fetchRentalByGroupcationId = createAsyncThunk(
  "rental/fetchRentalsByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH RENTAL TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: rentals, error: rentalError } = await supabase
      .from("rentals")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (rentalError) throw new Error(rentalError.message);
    if (!rentals || rentals.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON RENTAL ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("rental_travelers")
      .select("*")
      .in(
        "rental_id",
        rentals.map((rental) => rental.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON RENTAL ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("rental_attachments")
      .select("*")
      .in(
        "rental_id",
        rentals.map((rental) => rental.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: RENTAL + TRAVELERS + ATTACHMENTS --- //
    const result = rentals.map((rental) => {
      // Get travelers for the current rental
      const rentalTravelers = travelers.filter(
        (traveler) => traveler.rental_id === rental.id
      );

      // Get attachments for the current rental
      const rentalAttachments = attachments.filter(
        (attachment) => attachment.rental_id === rental.id
      );

      // Combine the rental data with its associated travelers and attachments
      const sanitizedRental = replaceNullWithUndefined(rental);
      const convertedDataDates = convertFormDatesToString(sanitizedRental);
      const combinedRentalData = transformToCamelCase({
        ...convertedDataDates,
        id: rental.id.toString(),
        travelers: rentalTravelers, // Add travelers to the rental data
        attachments: rentalAttachments, // Add attachments to the rental data
      });

      return combinedRentalData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchRentalTable = createAsyncThunk(
  "rental/fetchRentals",
  async (rentalId: string) => {
    // --- STEP 1: FETCH RENTAL TABLE (based on rentalId) --- //
    const { data: rentalData, error: rentalError } = await supabase
      .from("rentals")
      .select("*")
      .eq("id", rentalId);

    // IF ERROR OR NO DATA
    if (rentalError) throw new Error(rentalError.message);
    if (!rentalData || rentalData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = rentalData.map((rental) => {
      const sanitizedRental = replaceNullWithUndefined(rental);
      const convertedDataDates = convertFormDatesToString(sanitizedRental);
      return transformToCamelCase({
        ...convertedDataDates,
        id: rental.id.toString(),
      });
    });

    // --- STEP 3: FETCH RENTAL ATTACHMENTS (rental attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("rental_attachments")
      .select("*")
      .eq("rental_id", rentalId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH RENTAL TRAVELERS (rental travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("rental_travelers")
      .select("*")
      .eq("rental_id", rentalId);

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

    // --- STEP 5: COMBINE RENTAL, RENTAL ATTACHMENTS, & RENTAL TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((rental) => ({
      ...rental,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addRentalTable = createAsyncThunk(
  "rental/addRental",
  async (
    {
      rental,
      files,
      travelers,
    }: {
      rental: RentalTable;
      files?: RentalAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH RENTAL TABLE (for storage in supabase) --- ///
    const convertedRentalData = transformToSnakeCase(rental);

    // --- STEP 2: ADD RENTAL TABLE --- ///
    const { data, error } = await supabase
      .from("rentals")
      .insert([convertedRentalData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB RENTAL TABLE DATA --- //
    /* 
      We grab the rental table data because the 
      ID of the rental table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newRental = {
      ...data[0],
      id: data[0].id.toString(),
    } as Rental;

    // STEP 4: CONVERT RENTAL TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newRental))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the rentalId/addedBy from rental table (see above)
      to the addRentalAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addRentalAttachmentsTable({
          files,
          rentalId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addRentalTravelersTable({ travelers, rentalId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateRentalTable = createAsyncThunk(
  "rental/updateRental",
  async (
    {
      rental,
      files,
      selectedTravelers,
    }: {
      rental: RentalTable;
      files?: RentalAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR RENTAL TABLE UPDATE --- //
    const { id, attachments, travelers, ...rentalData } =
      transformToSnakeCase(rental);

    // --- STEP 2: UPDATE AND RETURN RENTAL TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("rentals")
      .update(rentalData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newRental = {
      ...data[0],
      id: data[0].id.toString(),
    } as Rental;

    const convertedDataDates = convertFormDatesToString(newRental);

    const sanitizedRental = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedRental);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("rental_attachments")
        .select("id, file_name")
        .eq("rental_id", id);

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
            deleteRentalAttachment({ attachmentId, rentalId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("rental_travelers")
        .select("traveler_id")
        .eq("rental_id", id);

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
            deleteRentalTraveler({ travelerId, rentalId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addRentalAttachmentsTable({
          files,
          rentalId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addRentalTravelersTable({
          travelers: selectedTravelers,
          rentalId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED RENTAL DATA --- //
    return convertedReturnData;
  }
);

export const deleteRentalTable = createAsyncThunk(
  "rental/deleteRental",
  async (rentalId: string) => {
      // --- STEP 1: DELETE RENTAL TRAVELERS ASSOCIATED WITH THIS ID --- //
      const { error: travelerError } = await supabase
      .from("rental_travelers")
      .delete()
      .eq("rental_id", rentalId);

    if (travelerError) {
      throw new Error(`Error deleting travelers: ${travelerError.message}`);
    }

    // --- STEP 2: DELETE RENTAL ATTACHMENTS ASSOCIATED WITH THIS ID --- //
    const { error: attachmentError } = await supabase
      .from("rental_attachments")
      .delete()
      .eq("rental_id", rentalId);

    if (attachmentError) {
      throw new Error(`Error deleting attachments: ${attachmentError.message}`);
    }

    // --- STEP 3: DELETE THE RENTAL TABLE --- //
    const { error } = await supabase.from("rentals").delete().eq("id", rentalId);

    if (error) {
      throw new Error(`Error deleting rental: ${error.message}`);
    }

    // --- STEP 4: RETURN RENTAL ID TO STATE --- //
    return rentalId;
  }
);

// --- RENTAL ATTACHMENTS --- //
export const addRentalAttachmentsTable = createAsyncThunk(
  "rental/addRentalAttachment",
  async ({
    files,
    rentalId,
    addedBy,
  }: {
    files: RentalAttachments[];
    rentalId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON RENTAL ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("rental_attachments")
        .select("file_name")
        .eq("rental_id", rentalId);

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
        files found from the rental attachments table
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

          // CREATE A FILE PATH (add rental-attachments from more definition)
          const filePath = `rental-attachments/${rentalId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR RENTAL ATTACHMENTS TABLE UPDATE
          return {
            rentalId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH RENTAL ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the rental attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO RENTAL ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("rental_attachments")
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
      console.error("Error adding rental attachments:", error);
      throw error;
    }
  }
);

export const deleteRentalAttachment = createAsyncThunk(
  "rental/deleteRentalAttachment",
  async ({
    attachmentId,
    rentalId,
  }: {
    attachmentId: number | string;
    rentalId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM RENTAL ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("rental_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, rentalId };
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

      // --- STEP 4: DELETE FILE FROM RENTAL ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("rental_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("rental_id", rentalId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, rentalId };
    } catch (error) {
      console.error("Error deleting rental attachment:", error);
      throw error;
    }
  }
);

// --- RENTAL TRAVELERS --- //
export const addRentalTravelersTable = createAsyncThunk(
  "rental/addRentalTravelers",
  async ({
    travelers,
    rentalId,
  }: {
    travelers: Traveler[];
    rentalId: string;
  }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY RENTAL ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("rental_travelers")
        .select("traveler_id")
        .eq("rental_id", rentalId);

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
        return { travelers: [], rentalId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR RENTAL TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          rental_id: rentalId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO RENTAL TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("rental_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.error("ERROR:", error);

      // --- STEP 5: RETURN TRAVELERS & RENTAL ID TO STATE --- ///
      return { travelers, rentalId };
    } catch (error) {
      console.error("Error adding rental travelers:", error);
      throw error;
    }
  }
);

export const deleteRentalTraveler = createAsyncThunk(
  "rental/deleteRentalTraveler",
  async ({
    travelerId,
    rentalId,
  }: {
    travelerId: number | string;
    rentalId: string;
  }) => {
    try {
      // --- STEP 1: DETELE RENTAL TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("rental_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("rental_id", rentalId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, rentalId };
    } catch (error) {
      console.error("Error deleting rental traveler:", error);
      throw error;
    }
  }
);
