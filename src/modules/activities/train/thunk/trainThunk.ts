import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "../../../../utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "../../../../utils/dateFunctions/dateFunctions";
import { supabase } from "../../../../lib/supabase";
import {
  TrainTable,
  TrainAttachments,
} from "../../../../types/trainTable.types";

// ----> NOTES <---- //
// TRAIN STATE: camalCASE
// TRAIN DB TABLE: snake_case

type Traveler = {
  value: string;
  label: string;
};

interface Train {
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
  attachments?: TrainAttachments[];
  notes?: string;
}

// --- TRAIN TABLE --- //
export const fetchTrainByGroupcationId = createAsyncThunk(
  "train/fetchTrainsByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH TRAIN TABLE BASED ON ITS GROUPCATION ID --- //
    const { data, error } = await supabase
      .from("trains")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return [];

    // --- STEP 2: RETURN DATA TO STATE (data is converted to match state) --- //
    return data.map((train) => {
      const sanitizedTrain = replaceNullWithUndefined(train);
      const convertedDataDates = convertFormDatesToString(sanitizedTrain);
      return transformToCamelCase({
        ...convertedDataDates,
        id: train.id.toString(),
      });
    });
  }
);

export const fetchTrainTable = createAsyncThunk(
  "train/fetchTrains",
  async (trainId: string) => {
    // --- STEP 1: FETCH TRAIN TABLE (based on trainId) --- //
    const { data: trainData, error: trainError } = await supabase
      .from("trains")
      .select("*")
      .eq("id", trainId);

    // IF ERROR OR NO DATA
    if (trainError) throw new Error(trainError.message);
    if (!trainData || trainData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = trainData.map((train) => {
      const sanitizedTrain = replaceNullWithUndefined(train);
      const convertedDataDates = convertFormDatesToString(sanitizedTrain);
      return transformToCamelCase({
        ...convertedDataDates,
        id: train.id.toString(),
      });
    });

    // --- STEP 3: FETCH TRAIN ATTACHMENTS (train attachments table) --- //
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("train_attachments")
      .select("*")
      .eq("train_id", trainId);

    // IF ERROR
    if (attachmentError)
      console.warn("Error fetching attachments:", attachmentError.message);

    // --- STEP 4: COMBINE TRAIN & TRAIN ATTACHMENTS TABLE DATA FOR STATE UPDATE --- ///
    return returnData.map((train) => ({
      ...train,
      attachments: attachmentData
        ? attachmentData.map((att) => transformToCamelCase(att))
        : [],
    }));
  }
);

export const addTrainTable = createAsyncThunk(
  "train/addTrain",
  async (
    { train, files }: { train: TrainTable; files?: TrainAttachments[] },
    { dispatch }
  ) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH TRAIN TABLE (for storage in supabase) --- ///
    const convertedTrainData = transformToSnakeCase(train);

    // --- STEP 2: ADD TRAIN TABLE --- ///
    const { data, error } = await supabase
      .from("trains")
      .insert([convertedTrainData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB TRAIN TABLE DATA --- //
    /* 
      We grab the train table data because the 
      ID of the train table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newTrain = {
      ...data[0],
      id: data[0].id.toString(),
    } as Train;

    // STEP 4: CONVERT TRAIN TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newTrain))
    );

    // --- STEP 5: CHECK FOR ATTACHMENTS (upload them and update state) --- //
    /*
      Check if files were passed from the form, if so then
      pass in the files, the trainId/addedBy from train table (see above)
      to the addTrainAttachmentsTable function
    */
    if (files && files.length > 0) {
      await dispatch(
        addTrainAttachmentsTable({
          files,
          trainId: convertedData.id,
          addedBy: 3,
        })
      );
    }

    // --- STEP 6: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateTrainTable = createAsyncThunk(
  "train/updateTrain",
  async (
    { train, files }: { train: TrainTable; files?: TrainAttachments[] },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR TRAIN TABLE UPDATE --- //
    const { id, attachments, ...trainData } = transformToSnakeCase(train);

    // --- STEP 2: UPDATE AND RETURN TRAIN TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("trains")
      .update(trainData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newTrain = {
      ...data[0],
      id: data[0].id.toString(),
    } as Train;

    const convertedDataDates = convertFormDatesToString(newTrain);
    const sanitizedTrain = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedTrain);

    // --- STEP 3: FETCH EXISTING ATTACHMENTS ---
    // Find existing attachments table (if any)
    const { data: existingAttachments, error: fetchError } = await supabase
      .from("train_attachments")
      .select("id, file_name")
      .eq("train_id", id);

    // IF ERROR
    if (fetchError)
      throw new Error(
        `Failed to fetch existing attachments: ${fetchError.message}`
      );

    // --- STEP 4: IDENTIFY ATTACHMENTS TO DELETE ---
    // Compare attachments passed from form to those in database
    const passedFileNames = new Set(files?.map((file) => file.fileName) || []);

    const attachmentsToDelete = existingAttachments
      .filter((attachment) => !passedFileNames.has(attachment.file_name))
      .map((attachment) => attachment.id);

    // --- STEP 5: DELETE ATTACHMENTS  ---
    // Delete those arrachments that are not needed
    if (attachmentsToDelete.length > 0) {
      await Promise.all(
        attachmentsToDelete.map(async (attachmentId: string | number) => {
          await dispatch(deleteTrainAttachment({ attachmentId, trainId: id }));
        })
      );
    }

    // --- STEP 6: UPLOAD NEW ATTACHMENTS ---
    if (files && files.length > 0) {
      await dispatch(
        addTrainAttachmentsTable({
          files,
          trainId: convertedReturnData.id,
          addedBy: 3,
        })
      );
    }

    // --- STEP 7: RETURN CONVERTED TRAIN DATA --- //
    return convertedReturnData;
  }
);

export const deleteTrainTable = createAsyncThunk(
  "train/deleteTrain",
  async (trainId: string) => {
    // --- STEP 1: DETELE TRAIN TABLE BASED ON TRAIN ID --- //
    const { error } = await supabase.from("trains").delete().eq("id", trainId);
    if (error) {
      throw new Error(error.message);
    }

    // --- STEP 2: PASS TRAIN ID TO STATE (so state can delete train) ---//
    return trainId;
  }
);

// --- TRAIN ATTACHMENTS --- //
export const addTrainAttachmentsTable = createAsyncThunk(
  "train/addTrainAttachment",
  async ({
    files,
    trainId,
    addedBy,
  }: {
    files: TrainAttachments[];
    trainId: string;
    addedBy: number;
  }) => {
    try {
      // --- STEP 1: FETCH EXISTING ATTACHMENTS BASED ON TRAIN ID --- //
      const { data: existingAttachments, error: fetchError } = await supabase
        .from("train_attachments")
        .select("file_name")
        .eq("train_id", trainId);

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
        files found from the train attachments table
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

          // CREATE A FILE PATH (add train-attachments from more definition)
          const filePath = `train-attachments/${trainId}/${Date.now()}_${sanitizedFileName}`;

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

          // CONVERT STRUCTURE TO ALLOW FOR TRAIN ATTACHMENTS TABLE UPDATE
          return {
            trainId,
            addedBy,
            fileUrl,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            file,
          };
        })
      );

      // --- STEP 5: TRANFORM THE RETURN OBJECT FROM THE UPLOADED FILES TO MATCH TRAIN ATTACHMENTS TABLE --- //
      /*
        Remove `file` from the data going to DB,
        File should only appear in State NOT the train attachments table
      */
      const convertedUploadedFiles = transformToSnakeCase(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uploadedFiles.map(({ file, ...rest }) => rest)
      );

      // --- STEP 6: ADD TO TRAIN ATTACHMENTS TABLE --- //
      const { data, error } = await supabase
        .from("train_attachments")
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
      console.error("Error adding train attachments:", error);
      throw error;
    }
  }
);

export const deleteTrainAttachment = createAsyncThunk(
  "train/deleteTrainAttachment",
  async ({
    attachmentId,
    trainId,
  }: {
    attachmentId: number | string;
    trainId: string;
  }) => {
    try {
      // --- STEP 1: GET FILE PATH FROM TRAIN ATTACHMENTS TABLE --- //
      const { data: attachment, error: fetchError } = await supabase
        .from("train_attachments")
        .select("file_url")
        .eq("id", attachmentId)
        .single();

      // IF FETCH ERROR
      if (fetchError)
        throw new Error(`Error fetching attachment: ${fetchError.message}`);

      // IF NOT FILE URL -> STILL RETURN PAYLOAD TO STATE
      if (!attachment?.file_url) {
        console.warn(`No file URL found for attachment ${attachmentId}`);
        return { attachmentId, trainId };
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

      // --- STEP 4: DELETE FILE FROM TRAIN ATTACHMENTS TABLE --- //
      const { error } = await supabase
        .from("train_attachments")
        .delete()
        .eq("id", attachmentId)
        .eq("train_id", trainId);

      // IF ERROR
      if (error)
        throw new Error(`Error deleting attachment from DB: ${error.message}`);

      // --- STEP 5: RETURN TO STATE (so state can delete attachment) --- //
      return { attachmentId, trainId };
    } catch (error) {
      console.error("Error deleting train attachment:", error);
      throw error;
    }
  }
);
