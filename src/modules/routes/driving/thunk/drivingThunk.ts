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

type Traveler = {
  value: number;
  label: string;
};

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
  travelers?: Traveler[];
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

    // --- STEP 2: FETCH TRAVELER DATA BASED ON DRIVINGID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("driving_travelers")
      .select("*")
      .in(
        "driving_id",
        drivingRoutes.map((n) => n.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: CONVERT DATA --- //
    const result = drivingRoutes.map((drivingRoute) => {
      // Get travelers for the current driving route
      const drivingTravelers = travelers.filter(
        (traveler) => traveler.driving_id === drivingRoute.id
      );

      const sanitizedDriving = replaceNullWithUndefined(drivingRoute);
      const convertedDataDates = convertFormDatesToString(sanitizedDriving);
      const combinedDrivingRouteData = transformToCamelCase({
        ...convertedDataDates,
        id: drivingRoute.id.toString(),
        travelers: drivingTravelers,
      });

      return combinedDrivingRouteData;
    });

    // --- STEP 4: RETURN COMBINED DATA TO STATE --- //
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

    // --- STEP 4: FETCH DRIVING TRAVELERS (driving travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("driving_travelers")
      .select("*")
      .eq("driving_id", drivingId);

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

    // --- STEP 2: CONVERT RETURN DATA TO MATCH STATE --- ///
    const returnData = drivingRouteData.map((driving) => {
      const sanitizedDriving = replaceNullWithUndefined(driving);
      const convertedDataDates = convertFormDatesToString(sanitizedDriving);
      return transformToCamelCase({
        ...convertedDataDates,
        id: driving.id.toString(),
        travelers: convertedTravelers ? convertedTravelers : [],
      });
    });

    // --- STEP 3: RETURN DRIVING TABLE DATA FOR STATE UPDATE --- ///
    return returnData;
  }
);

export const addDrivingTable = createAsyncThunk(
  "driving/addDrivingRoute",
  async (
    {
      driving,
      travelers,
    }: { driving: DrivingRouteTable; travelers?: Traveler[] },
    { dispatch }
  ) => {
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

    if (travelers && travelers.length > 0) {
      await dispatch(
        addDrivingTravelersTable({ travelers, drivingId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 5: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateDrivingTable = createAsyncThunk(
  "driving/updateDrivingRoute",
  async (
    {
      driving,
      selectedTravelers,
    }: { driving: DrivingRouteTable; selectedTravelers?: Traveler[] },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR DRIVING TABLE UPDATE --- //
    const { id, travelers, ...drivingRouteData } =
      transformToSnakeCase(driving);

    // --- STEP 2: UPDATE AND RETURN DRIVING TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("driving_routes")
      .update(drivingRouteData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("driving_travelers")
        .select("traveler_id")
        .eq("driving_id", id);

    // IF ERROR
    if (fetchTravelerError)
      console.error("Error fetching existing travelers:", fetchTravelerError);

    const existingTravelerIds = new Set(
      existingTravelers?.map((t) => t.traveler_id) || []
    );
    const selectedTravelerIds = new Set(
      selectedTravelers?.map((t) => t.value) || []
    );

    // --- STEP 4: IDENTIFY TRAVELERS TO DELETE --- //
    // Find travelers that exist in DB but were removed from the form
    const travelersToDelete = [...existingTravelerIds].filter(
      (travelerId) => !selectedTravelerIds.has(travelerId)
    );

    // --- STEP 5: DELETE TRAVELERS --- //
    if (travelersToDelete.length > 0) {
      await Promise.all(
        travelersToDelete.map(async (travelerId) => {
          await dispatch(
            deleteDrivingTraveler({ travelerId, drivingId: id })
          ).unwrap();
        })
      );
    }

    // CONVERT FOR STATE UPDATE
    const newDriving = {
      ...data[0],
      id: data[0].id.toString(),
    } as DrivingRoute;

    const convertedDataDates = convertFormDatesToString(newDriving);

    const sanitizedDriving = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedDriving);

    // --- STEP 6: RETURN CONVERTED DRIVING DATA --- //
    return convertedReturnData;
  }
);

export const deleteDrivingTable = createAsyncThunk(
  "driving/deleteDrivingRoute",
  async (drivingId: string) => {
    // --- STEP 1: DELETE DRIVING TRAVELERS ASSOCIATED WITH THIS DRIVING ID --- //
    const { error: travelerError } = await supabase
      .from("driving_travelers")
      .delete()
      .eq("driving_id", drivingId);

    if (travelerError) {
      throw new Error(`Error deleting travelers: ${travelerError.message}`);
    }

    // --- STEP 2: DETELE DRIVING TABLE BASED ON DRIVING ID --- //
    const { error } = await supabase
      .from("driving_routes")
      .delete()
      .eq("id", drivingId);
    if (error) {
      throw new Error(error.message);
    }

    // --- STEP 3: PASS DRIVING ID TO STATE (so state can delete driving) ---//
    return drivingId;
  }
);

// --- DRIVING TRAVELERS --- //
export const addDrivingTravelersTable = createAsyncThunk(
  "driving/addDrivingTravelers",
  async ({
    travelers,
    drivingId,
  }: {
    travelers: Traveler[];
    drivingId: string;
  }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY DRIVINGID --- //

      const { data: existingTravelers, error: fetchError } = await supabase
        .from("driving_travelers")
        .select("traveler_id")
        .eq("driving_id", drivingId);

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
        return { travelers: [], drivingId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR DRIVINGTRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          driving_id: drivingId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO DRIVINGTRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("driving_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.log("ERROR:", error);

      console.log("Sucess:", data);

      // --- STEP 5: RETURN TRAVELERS & DRIVINGID TO STATE --- ///
      return { travelers, drivingId };
    } catch (error) {
      console.error("Error adding driving travelers:", error);
      throw error;
    }
  }
);

export const deleteDrivingTraveler = createAsyncThunk(
  "driving/deleteDrivingTraveler",
  async ({
    travelerId,
    drivingId,
  }: {
    travelerId: number | string;
    drivingId: string;
  }) => {
    try {
      // --- STEP 1: DETELE DRIVINGTRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("driving_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("driving_id", drivingId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, drivingId };
    } catch (error) {
      console.error("Error deleting driving traveler:", error);
      throw error;
    }
  }
);
