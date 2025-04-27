import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  replaceNullWithUndefined,
  transformToCamelCase,
  transformToSnakeCase,
} from "@utils/conversionFunctions/conversionFunctions";
import { convertFormDatesToString } from "@utils/dateFunctions/dateFunctions";
import { supabase } from "@lib/supabase";
import { DrivingRouteTable } from "@/tableTypes/drivingRouteTable";

// ----> NOTES <---- //
// DRIVING STATE: camalCASE
// DRIVING DB TABLE: snake_case

interface DrivingRoute {
  id: string;
  groupcationId?: number;
  createdBy?: number;
  driveDuration: string;
  departureLocation: string;
  departureDate: string;
  departureTime: string;
  arrivalLocation: string;
  arrivalDate?: string;
  notes?: string;
}

// --- DRIVING TABLE --- //
export const fetchDrivingRouteByGroupcationId = createAsyncThunk(
  "driving/fetchDrivingRoutesByGroupcation",
  async (groupcationId: number) => {
    // --- STEP 1: FETCH DRIVING TABLE BASED ON ITS GROUPCATION ID --- //
    const { data: drivingRoutes, error: drivingRoutesError } = await supabase
      .from("driving_routes")
      .select("*")
      .eq("groupcation_id", groupcationId);

    // IF ERROR OR NO DATA
    if (drivingRoutesError) throw new Error(drivingRoutesError.message);
    if (!drivingRoutes || drivingRoutes.length === 0) return [];

    // --- STEP 4: CONVERT DATA --- //
    const result = drivingRoutes.map((drivingRoute) => {
      const sanitizedDriving = replaceNullWithUndefined(drivingRoute);
      const convertedDataDates = convertFormDatesToString(sanitizedDriving);
      const combinedDrivingRouteData = transformToCamelCase({
        ...convertedDataDates,
        id: drivingRoute.id.toString(),
      });

      return combinedDrivingRouteData;
    });

    // --- STEP 5: RETURN COMBINED DATA TO STATE --- //
    return result;
  }
);

export const fetchDrivingRouteTable = createAsyncThunk(
  "driving/fetchDrivingRoutes",
  async (drivingId: string) => {
    // --- STEP 1: FETCH DRIVING TABLE (based on drivingId) --- //
    const { data: drivingRouteData, error: drivingRouteError } = await supabase
      .from("driving_routes")
      .select("*")
      .eq("id", drivingId);

    // IF ERROR OR NO DATA
    if (drivingRouteError) throw new Error(drivingRouteError.message);
    if (!drivingRouteData || drivingRouteData.length === 0) return [];

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = drivingRouteData.map((driving) => {
      const sanitizedDriving = replaceNullWithUndefined(driving);
      const convertedDataDates = convertFormDatesToString(sanitizedDriving);
      return transformToCamelCase({
        ...convertedDataDates,
        id: driving.id.toString(),
      });
    });

    // --- STEP 5: RETURN DRIVING TABLE DATA FOR STATE UPDATE --- ///
    return returnData;
  }
);

export const addDrivingTable = createAsyncThunk(
  "driving/addDrivingRoute",
  async ({ driving }: { driving: DrivingRouteTable }) => {
    // --- STEP 1: CONVERT PASSED IN DATA TO MATCH DRIVING TABLE (for storage in supabase) --- ///
    const convertedDrivingData = transformToSnakeCase(driving);

    // --- STEP 2: ADD DRIVING TABLE --- ///
    const { data, error } = await supabase
      .from("driving_routes")
      .insert([convertedDrivingData])
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: GRAB DRIVING TABLE DATA --- //
    /* 
      We grab the driving table data because the 
      ID of the driving table is created by supabase (automatically) 
      and is needed for the state update
    */
    const newDrivingRoute = {
      ...data[0],
      id: data[0].id.toString(),
    } as DrivingRoute;

    // STEP 4: CONVERT DRIVING TABLE DATA TO MATCH STATE --- //
    const convertedData = transformToCamelCase(
      replaceNullWithUndefined(convertFormDatesToString(newDrivingRoute))
    );

    // --- STEP 5: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateDrivingTable = createAsyncThunk(
  "driving/updateDrivingRoute",
  async ({ driving }: { driving: DrivingRouteTable }) => {
    // --- STEP 1: TRANFORM DATA FOR DRIVING TABLE UPDATE --- //
    const { id, ...drivingRouteData } = transformToSnakeCase(driving);

    // --- STEP 2: UPDATE AND RETURN DRIVING TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("driving_routes")
      .update(drivingRouteData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // CONVERT FOR STATE UPDATE
    const newDriving = {
      ...data[0],
      id: data[0].id.toString(),
    } as DrivingRoute;

    const convertedDataDates = convertFormDatesToString(newDriving);

    const sanitizedDriving = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedDriving);

    // --- STEP 3: RETURN CONVERTED DRIVING DATA --- //
    return convertedReturnData;
  }
);

export const deleteDrivingTable = createAsyncThunk(
  "driving/deleteDrivingRoute",
  async (drivingId: string) => {
    // --- STEP 1: DETELE DRIVING TABLE BASED ON DRIVING ID --- //
    const { error } = await supabase
      .from("driving_routes")
      .delete()
      .eq("id", drivingId);
    if (error) {
      throw new Error(error.message);
    }

    // --- STEP 2: PASS DRIVING ID TO STATE (so state can delete driving) ---//
    return drivingId;
  }
);
