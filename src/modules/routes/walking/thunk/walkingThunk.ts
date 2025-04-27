import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";
import { supabase } from "@lib/supabase";
import { WalkingRouteTable } from "@/tableTypes/walkingRouteTable";

// ----> NOTES <---- //
// WALKING STATE: camalCASE
// WALKING DB TABLE: snake_case

interface WalkingRoute {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  walkDuration: string;
  departureLocation: string;
  departureDate: string;
  departureTime: string;
  arrivalLocation: string;
  notes?: string;
}

// --- WALKING TABLE --- //
export const fetchWalkingRouteByGroupcationId = createAsyncThunk(
  "walking/fetchWalkingRoutesByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH WALKING TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: walkingRoutes, error: walkingRoutesError } = await supabase
      .from("walking_routes")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (walkingRoutesError) throw new Error(walkingRoutesError.message);
    if (!walkingRoutes || walkingRoutes.length === 0) return [];

    // --- STEP 4: CONVERT DATA --- //
    const result = walkingRoutes.map((walkingRoute) => {
      const sanitizedWalking = replaceNullWithUndefined(walkingRoute);
      const convertedDataDates = convertFormDatesToString(sanitizedWalking);
      const combinedWalkingRouteData = transformToCamelCase({
        ...convertedDataDates,
        id: walkingRoute.id.toString(),
      });

      return combinedWalkingRouteData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchWalkingRouteTable = createAsyncThunk(
  "walking/fetchWalkingRoutes",
  async (walkingId: string) => {
    // --- STEP 1: FETCH WALKING TABLE (based on walkingId) --- //
    const { data: walkingRouteData, error: walkingRouteError } = await supabase
      .from("walking_routes")
      .select("*")
      .eq("id", walkingId);

    // IF ERROR OR NO DATA
    if (walkingRouteError) throw new Error(walkingRouteError.message);
    if (!walkingRouteData || walkingRouteData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = walkingRouteData.map((walking) => {
      const sanitizedWalking = replaceNullWithUndefined(walking);
      const convertedDataDates = convertFormDatesToString(sanitizedWalking);
      return transformToCamelCase({
        ...convertedDataDates,
        id: walking.id.toString(),
      });
    });

    // --- STEP 5: RETURN WALKING TABLE DATA FOR STATE UPDATE --- ///
    return returnData;
  }
);

export const addWalkingTable = createAsyncThunk(
  "walking/addWalkingRoute",
  async ({ walking }: { walking: WalkingRouteTable }) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH WALKING TABLE (for storage in supabase) --- ///
    const convertedWalkingData = transformToSnakeCase(walking);

    // --- STEP 2: ADD WALKING TABLE --- ///
    const { data, error } = await supabase
      .from("walking_routes")
      .insert([convertedWalkingData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB WALKING TABLE DATA --- //
    /* 
      We grab the walking table data because the 
      ID of the walking table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newWalkingRoute = {
      ...data[0],
      id: data[0].id.toString(),
    } as WalkingRoute;

    // STEP 4: CONVERT WALKING TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newWalkingRoute))
    );

    // --- STEP 5: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateWalkingTable = createAsyncThunk(
  "walking/updateWalkingRoute",
  async ({ walking }: { walking: WalkingRouteTable }) => {
    // --- STEP 1: TRANFORM DATA FOR WALKING TABLE UPDATE --- //
    const { id, ...walkingRouteData } = transformToSnakeCase(walking);

    // --- STEP 2: UPDATE AND RETURN WALKING TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("walking_routes")
      .update(walkingRouteData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newWalking = {
      ...data[0],
      id: data[0].id.toString(),
    } as WalkingRoute;

    const convertedDataDates = convertFormDatesToString(newWalking);

    const sanitizedWalking = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedWalking);

    // --- STEP 3: RETURN CONVERTED WALKING DATA --- //
    return convertedReturnData;
  }
);

export const deleteWalkingTable = createAsyncThunk(
  "walking/deleteWalkingRoute",
  async (walkingId: string) => {
    // --- STEP 1: DETELE WALKING TABLE BASED ON WALKING ID --- //
    const { error } = await supabase
      .from("walking_routes")
      .delete()
      .eq("id", walkingId);
    if (error) {
      throw new Error(error.message);
    }

    // --- STEP 2: PASS WALKING ID TO STATE (so state can delete walking) ---//
    return walkingId;
  }
);
