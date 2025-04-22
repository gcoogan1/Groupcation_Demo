import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  BusAttachments,
  BusTable,
} from "@tableTypes/busTable.types";
import { supabase } from "@lib/supabase";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";

type Traveler = {
  value: number;
  label: string;
};

interface Bus {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  busRoute: string;
  busClass: string;
  departureBusStop: string;
  departureDate: string;
  departureTime: string;
  arrivalBusStop: string;
  arrivalDate: string;
  arrivalTime: string;
  travelers?: Traveler[];
  cost?: string;
  attachments?: BusAttachments[];
  notes?: string;
}

export const fetchBusByGroupcationId = createAsyncThunk(
  "bus/fetchBusByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH BUS TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: buses, error: busError } = await supabase
      .from("buses")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (busError) throw new Error(busError.message);
    if (!buses || buses.length === 0) return [];

    // --- STEP 2: FETCH TRAVELER DATA BASED ON BUS ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("bus_travelers")
      .select("*")
      .in(
        "bus_id",
        buses.map((bus) => bus.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: FETCH ATTACHMENTS BASED ON BUS ID --- //
    const { data: attachments, error: attachmentError } = await supabase
      .from("bus_attachments")
      .select("*")
      .in(
        "bus_id",
        buses.map((bus) => bus.id)
      );

    if (attachmentError) throw new Error(attachmentError.message);

    // --- STEP 4: COMBINE DATA: BUS + TRAVELERS + ATTACHMENTS --- //
    const result = buses.map((bus) => {
      // Get travelers for the current bus
      const busTravelers = travelers.filter(
        (traveler) => traveler.bus_id === bus.id
      );

      // Get attachments for the current bus
      const busAttachments = attachments.filter(
        (attachment) => attachment.bus_id === bus.id
      );

      // Combine the bus data with its associated travelers and attachments
      const sanitizedBus = replaceNullWithUndefined(bus);
      const convertedDataDates = convertFormDatesToString(sanitizedBus);
      const combinedBusData = transformToCamelCase({
        ...convertedDataDates,
        id: bus.id.toString(),
        travelers: busTravelers, // Add travelers to the bus data
        attachments: busAttachments, // Add attachments to the bus data
      });

      return combinedBusData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchBusTable = createAsyncThunk(
  "bus/fetchBuses",
  async (busId: string) => {
    // --- STEP 1: FETCH BUSES TABLE (based on busId) --- //
    const { data: busData, error: busError } = await supabase
      .from("buses")
      .select("*")
      .eq("id", busId);

    // IF ERROR OR NO DATA
    if (busError) throw new Error(busError.message);
    if (!busData || busData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = busData.map((bus) => {
      const sanitizedBus = replaceNullWithUndefined(bus);
      const convertedDataDates = convertFormDatesToString(sanitizedBus);
      return transformToCamelCase({
        ...convertedDataDates,
        id: bus.id.toString(),
      });
    });

    // --- STEP 3: FETCH BUS ATTACHMENTS (bus attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("bus_attachments")
      .select("*")
      .eq("bus_id", busId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: FETCH BUS TRAVELERS (bus travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("bus_travelers")
      .select("*")
      .eq("bus_id", busId);

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

    // --- STEP 5: COMBINE BUS, BUS ATTACHMENTS, & BUS TRAVELERS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((bus) => ({
      ...bus,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
      travelers: convertedTravelers ? convertedTravelers : [],
    }));
  }
);

export const addBusTable = createAsyncThunk(
  "bus/addBus",
  async (
    {
      bus,
      files,
      travelers,
    }: {
      bus: BusTable;
      files?: BusAttachments[];
      travelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH BUS TABLE (for storage in supabase) --- ///
    const convertedBusData = transformToSnakeCase(bus);

    // --- STEP 2: ADD BUS TABLE --- ///
    const { data, error } = await supabase
      .from("buses")
      .insert([convertedBusData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB BUS TABLE DATA --- //
    /* 
      We grab the bus table data because the 
      ID of the bus table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newBus = {
      ...data[0],
      id: data[0].id.toString(),
    } as Bus;

    // STEP 4: CONVERT BUS TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newBus))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the busId/addedBy from bus table (see above)
      to the addBusAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addBusAttachmentsTable({
          files,
          busId: convertedData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (travelers && travelers.length > 0) {
      await dispatch(
        addBusTravelersTable({ travelers, busId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateBusTable = createAsyncThunk(
  "bus/updateBus",
  async (
    {
      bus,
      files,
      selectedTravelers,
    }: {
      bus: BusTable;
      files?: BusAttachments[];
      selectedTravelers?: Traveler[];
    },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR BUS TABLE UPDATE --- //
    const { id, attachments, travelers, ...busData } =
      transformToSnakeCase(bus);

    // --- STEP 2: UPDATE AND RETURN BUS TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("buses")
      .update(busData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newBus = {
      ...data[0],
      id: data[0].id.toString(),
    } as Bus;

    const convertedDataDates = convertFormDatesToString(newBus);

    const sanitizedBus = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedBus);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchAttachmentError } =
      await supabase
        .from("bus_attachments")
        .select("id, file_name")
        .eq("bus_id", id);

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
    // Delete those attachments that are not needed
    if (attachmentsToDelete.length > 0) {
      await Promise.all(
        attachmentsToDelete.map(async (attachmentId: string | number) => {
          await dispatch(
            deleteBusAttachment({ attachmentId, busId: id })
          ).unwrap();
        })
      );
    }

    // --- STEP 6: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("bus_travelers")
        .select("traveler_id")
        .eq("bus_id", id);

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
          await dispatch(deleteBusTraveler({ travelerId, busId: id })).unwrap();
        })
      );
    }

    // --- STEP 9: UPLOAD NEW ATTACHMENTS --- //
    if (files && files.length > 0) {
      await dispatch(
        addBusAttachmentsTable({
          files,
          busId: convertedReturnData.id,
          addedBy: 3,
        })
      ).unwrap();
    }

    if (selectedTravelers && selectedTravelers.length > 0) {
      await dispatch(
        addBusTravelersTable({
          travelers: selectedTravelers,
          busId: convertedReturnData.id,
        })
      ).unwrap();
    }

    // --- STEP 10: RETURN CONVERTED BUS DATA --- //
    return convertedReturnData;
  }
);

export const deleteBusTable = createAsyncThunk(
  "bus/deleteBus",
  async (busId: string) => {
    // --- STEP 1: DETELE BUS TABLE BASED ON BUS ID --- //
    const { error } = await supabase.from("buses").delete().eq("id", busId);
    if (error) {
      throw new Error(error.message);
    }

    // --- STEP 2: PASS BUS ID TO STATE (so state can delete bus) ---//
    return busId;
  }
);

// --- BUS ATTACHMENTS --- //
export const addBusAttachmentsTable = createAsyncThunk(
  "bus/addBusAttachment",
  async ({
    files,
    busId,
    addedBy,
  }: {
    files: BusAttachments[];
    busId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON BUS ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("bus_attachments")
        .select("file_name")
        .eq("bus_id", busId);

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
        files found from the bus attachments table
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

          // CREATE A FILE PATH (add bus-attachments from more definition)
          const filePath = `bus-attachments/${busId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR BUS ATTACHMENTS TABLE UPDATE
          return {
            busId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH BUS ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the bus attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO BUS ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("bus_attachments")
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
      console.error("Error adding bus attachments:", error);
      throw error;
    }
  }
);

export const deleteBusAttachment = createAsyncThunk(
  "bus/deleteBusAttachment",
  async ({
    attachmentId,
    busId,
  }: {
    attachmentId: number | string;
    busId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM BUS ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("bus_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, busId };
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

      // --- STEP 4: DELETE FILE FROM BUS ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("bus_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("bus_id", busId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, busId };
    } catch (error) {
      console.error("Error deleting bus attachment:", error);
      throw error;
    }
  }
);

// --- BUS TRAVELERS --- //
export const addBusTravelersTable = createAsyncThunk(
  "bus/addBusTravelers",
  async ({ travelers, busId }: { travelers: Traveler[]; busId: string }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY BUS ID --- //
      const { data: existingTravelers, error: fetchError } = await supabase
        .from("bus_travelers")
        .select("traveler_id")
        .eq("bus_id", busId);

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
        return { travelers: [], busId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR BUS TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          bus_id: busId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO BUS TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("bus_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.error("ERROR:", error);

      // --- STEP 5: RETURN TRAVELERS & BUS ID TO STATE --- ///
      return { travelers, busId };
    } catch (error) {
      console.error("Error adding bus travelers:", error);
      throw error;
    }
  }
);

export const deleteBusTraveler = createAsyncThunk(
  "bus/deleteBusTraveler",
  async ({
    travelerId,
    busId,
  }: {
    travelerId: number | string;
    busId: string;
  }) => {
    try {
      // --- STEP 1: DETELE BUS TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("bus_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("bus_id", busId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, busId };
    } catch (error) {
      console.error("Error deleting bus traveler:", error);
      throw error;
    }
  }
);
