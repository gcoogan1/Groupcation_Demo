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
  RestaurantTable,
  RestaurantAttachments,
} from "@tableTypes/restaurantTable.types";

// ----> NOTES <---- //
// RESTAURANT STATE: camalCASE
// RESTAURANT DB TABLE: snake_case

type Traveler = {
  value: number;
  label: string;
};

interface Restaurant {
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
  attachments?: RestaurantAttachments[];
  notes?: string;
}

// --- RESTAURANT TABLE --- //
export const fetchRestaurantByGroupcationId = createAsyncThunk(
  "restaurant/fetchRestaurantsByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH RESTAURANT TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: restaurants, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (restaurantError) throw new Error(restaurantError.message);
    if (!restaurants || restaurants.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON RESTAURANT ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("restaurant_travelers")
      .select("*")
      .in(
        "restaurant_id",
        restaurants.map((restaurant) => restaurant.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON RESTAURANT ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("restaurant_attachments")
      .select("*")
      .in(
        "restaurant_id",
        restaurants.map((restaurant) => restaurant.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: RESTAURANT + TRAVELERS + ATTACHMENTS --- //
    const result = restaurants.map((restaurant) => {
      // Get travelers for the current restaurant
      const restaurantTravelers = travelers.filter(
        (traveler) => traveler.restaurant_id === restaurant.id
      );

      // Get attachments for the current restaurant
      const restaurantAttachments = attachments.filter(
        (attachment) => attachment.restaurant_id === restaurant.id
      );

      // Combine the restaurant data with its associated travelers and attachments
      const sanitizedRestaurant = replaceNullWithUndefined(restaurant);
      const convertedDataDates = convertFormDatesToString(sanitizedRestaurant);
      const combinedRestaurantData = transformToCamelCase({
        ...convertedDataDates,
        id: restaurant.id.toString(),
        travelers: restaurantTravelers, // Add travelers to the restaurant data
        attachments: restaurantAttachments, // Add attachments to the restaurant data
      });

      return combinedRestaurantData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchRestaurantTable = createAsyncThunk(
  "restaurant/fetchRestaurants",
  async (restaurantId: string) => {
    // --- STEP 1: FETCH RESTAURANT TABLE (based on restaurantId) --- //
    const { data: restaurantData, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId);

    // IF ERROR OR NO DATA
    if (restaurantError) throw new Error(restaurantError.message);
    if (!restaurantData || restaurantData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = restaurantData.map((restaurant) => {
      const sanitizedRestaurant = replaceNullWithUndefined(restaurant);
      const convertedDataDates = convertFormDatesToString(sanitizedRestaurant);
      return transformToCamelCase({
        ...convertedDataDates,
        id: restaurant.id.toString(),
      });
    });

    // --- STEP 3: FETCH RESTAURANT ATTACHMENTS (restaurant attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("restaurant_attachments")
      .select("*")
      .eq("restaurant_id", restaurantId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH RESTAURANT TRAVELERS (restaurant travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("restaurant_travelers")
      .select("*")
      .eq("restaurant_id", restaurantId);

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

    // --- STEP 5: COMBINE RESTAURANT, RESTAURANT ATTACHMENTS, & RESTAURANT TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((restaurant) => ({
      ...restaurant,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addRestaurantTable = createAsyncThunk(
  "restaurant/addRestaurant",
  async (
    {
      restaurant,
      files,
      travelers,
    }: {
      restaurant: RestaurantTable;
      files?: RestaurantAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH RESTAURANT TABLE (for storage in supabase) --- ///
    const convertedRestaurantData = transformToSnakeCase(restaurant);

    // --- STEP 2: ADD RESTAURANT TABLE --- ///
    const { data, error } = await supabase
      .from("restaurants")
      .insert([convertedRestaurantData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB RESTAURANT TABLE DATA --- //
    /* 
      We grab the restaurant table data because the 
      ID of the restaurant table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newRestaurant = {
      ...data[0],
      id: data[0].id.toString(),
    } as Restaurant;

    // STEP 4: CONVERT RESTAURANT TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newRestaurant))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the restaurantId/addedBy from restaurant table (see above)
      to the addRestaurantAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addRestaurantAttachmentsTable({
          files,
          restaurantId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addRestaurantTravelersTable({
          travelers,
          restaurantId: convertedData.id,
        })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateRestaurantTable = createAsyncThunk(
  "restaurant/updateRestaurant",
  async (
    {
      restaurant,
      files,
      selectedTravelers,
    }: {
      restaurant: RestaurantTable;
      files?: RestaurantAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR RESTAURANT TABLE UPDATE --- //
    const { id, attachments, travelers, ...restaurantData } =
      transformToSnakeCase(restaurant);

    // --- STEP 2: UPDATE AND RETURN RESTAURANT TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("restaurants")
      .update(restaurantData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newRestaurant = {
      ...data[0],
      id: data[0].id.toString(),
    } as Restaurant;

    const convertedDataDates = convertFormDatesToString(newRestaurant);

    const sanitizedRestaurant = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedRestaurant);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("restaurant_attachments")
        .select("id, file_name")
        .eq("restaurant_id", id);

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
            deleteRestaurantAttachment({ attachmentId, restaurantId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("restaurant_travelers")
        .select("traveler_id")
        .eq("restaurant_id", id);

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
            deleteRestaurantTraveler({ travelerId, restaurantId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addRestaurantAttachmentsTable({
          files,
          restaurantId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addRestaurantTravelersTable({
          travelers: selectedTravelers,
          restaurantId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED RESTAURANT DATA --- //
    return convertedReturnData;
  }
);

export const deleteRestaurantTable = createAsyncThunk(
  "restaurant/deleteRestaurant",
  async (restaurantId: string) => {
      // --- STEP 1: DELETE RESTAURANT TRAVELERS ASSOCIATED WITH THIS ID --- //
      const { error: travelerError } = await supabase
      .from("restaurant_travelers")
      .delete()
      .eq("restaurant_id", restaurantId);

    if (travelerError) {
      throw new Error(`Error deleting travelers: ${travelerError.message}`);
    }

    // --- STEP 2: DELETE RESTAURANT ATTACHMENTS ASSOCIATED WITH THIS ID --- //
    const { error: attachmentError } = await supabase
      .from("restaurant_attachments")
      .delete()
      .eq("restaurant_id", restaurantId);

    if (attachmentError) {
      throw new Error(`Error deleting attachments: ${attachmentError.message}`);
    }

    // --- STEP 3: DELETE THE RESTAURANT TABLE --- //
    const { error } = await supabase.from("restaurants").delete().eq("id", restaurantId);

    if (error) {
      throw new Error(`Error deleting restaurant: ${error.message}`);
    }

    // --- STEP 4: RETURN RESTAURANT ID TO STATE --- //
    return restaurantId;
  }
);

// --- RESTAURANT ATTACHMENTS --- //
export const addRestaurantAttachmentsTable = createAsyncThunk(
  "restaurant/addRestaurantAttachment",
  async ({
    files,
    restaurantId,
    addedBy,
  }: {
    files: RestaurantAttachments[];
    restaurantId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON RESTAURANT ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("restaurant_attachments")
        .select("file_name")
        .eq("restaurant_id", restaurantId);

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
        files found from the restaurant attachments table
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

          // CREATE A FILE PATH (add restaurant-attachments from more definition)
          const filePath = `restaurant-attachments/${restaurantId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR RESTAURANT ATTACHMENTS TABLE UPDATE
          return {
            restaurantId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH RESTAURANT ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the restaurant attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO RESTAURANT ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("restaurant_attachments")
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
      console.error("Error adding restaurant attachments:", error);
      throw error;
    }
  }
);

export const deleteRestaurantAttachment = createAsyncThunk(
  "restaurant/deleteRestaurantAttachment",
  async ({
    attachmentId,
    restaurantId,
  }: {
    attachmentId: number | string;
    restaurantId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM RESTAURANT ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("restaurant_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, restaurantId };
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

      // --- STEP 4: DELETE FILE FROM RESTAURANT ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("restaurant_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("restaurant_id", restaurantId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, restaurantId };
    } catch (error) {
      console.error("Error deleting restaurant attachment:", error);
      throw error;
    }
  }
);

// --- RESTAURANT TRAVELERS --- //
export const addRestaurantTravelersTable = createAsyncThunk(
  "restaurant/addRestaurantTravelers",
  async ({
    travelers,
    restaurantId,
  }: {
    travelers: Traveler[];
    restaurantId: string;
  }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY RESTAURANT ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("restaurant_travelers")
        .select("traveler_id")
        .eq("restaurant_id", restaurantId);

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
        return { travelers: [], restaurantId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR RESTAURANT TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          restaurant_id: restaurantId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO RESTAURANT TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("restaurant_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.error("ERROR:", error);

      // --- STEP 5: RETURN TRAVELERS & RESTAURANT ID TO STATE --- ///
      return { travelers, restaurantId };
    } catch (error) {
      console.error("Error adding restaurant travelers:", error);
      throw error;
    }
  }
);

export const deleteRestaurantTraveler = createAsyncThunk(
  "restaurant/deleteRestaurantTraveler",
  async ({
    travelerId,
    restaurantId,
  }: {
    travelerId: number | string;
    restaurantId: string;
  }) => {
    try {
      // --- STEP 1: DETELE RESTAURANT TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("restaurant_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("restaurant_id", restaurantId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, restaurantId };
    } catch (error) {
      console.error("Error deleting restaurant traveler:", error);
      throw error;
    }
  }
);
