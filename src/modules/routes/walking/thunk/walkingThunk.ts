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

type Traveler = {
  value: number;
  label: string;
};

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
  travelers?: Traveler[];
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

    // --- STEP 2: FETCH TRAVELER DATA BASED ON WALKING ID --- //
    const { data: travelers, error: travelerError } = await supabase
      .from("walking_travelers")
      .select("*")
      .in(
        "walking_id",
        walkingRoutes.map((n) => n.id)
      );

    if (travelerError) throw new Error(travelerError.message);

    // --- STEP 3: CONVERT DATA --- //
    const result = walkingRoutes.map((walkingRoute) => {
      // Get travelers for the current walking route
      const walkingTravelers = travelers.filter(
        (traveler) => traveler.walking_id === walkingRoute.id
      );

      const sanitizedWalking = replaceNullWithUndefined(walkingRoute);
      const convertedDataDates = convertFormDatesToString(sanitizedWalking);
      const combinedWalkingRouteData = transformToCamelCase({
        ...convertedDataDates,
        id: walkingRoute.id.toString(),
        travelers: walkingTravelers,
      });

      return combinedWalkingRouteData;
    });

    // --- STEP 4: RETURN COMBINED DATA TO STATE --- //
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

    // --- STEP 4: FETCH WALKING TRAVELERS (walking travelers table) --- //
    const { data: travelerData, error: travelerError } = await supabase
      .from("walking_travelers")
      .select("*")
      .eq("walking_id", walkingId);

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
    const returnData = walkingRouteData.map((walking) => {
      const sanitizedWalking = replaceNullWithUndefined(walking);
      const convertedDataDates = convertFormDatesToString(sanitizedWalking);
      return transformToCamelCase({
        ...convertedDataDates,
        id: walking.id.toString(),
        travelers: convertedTravelers ? convertedTravelers : [],
      });
    });

    // --- STEP 3: RETURN WALKING TABLE DATA FOR STATE UPDATE --- ///
    return returnData;
  }
);

export const addWalkingTable = createAsyncThunk(
  "walking/addWalkingRoute",
  async (
    {
      walking,
      travelers,
    }: { walking: WalkingRouteTable; travelers?: Traveler[] },
    { dispatch }
  ) => {
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

    if (travelers && travelers.length > 0) {
      await dispatch(
        addWalkingTravelersTable({ travelers, walkingId: convertedData.id })
      ).unwrap();
    }

    // --- STEP 5: RETURN CONVERTED DATA FOR STATE UPDATE --- //
    return convertedData;
  }
);

export const updateWalkingTable = createAsyncThunk(
  "walking/updateWalkingRoute",
  async (
    {
      walking,
      selectedTravelers,
    }: { walking: WalkingRouteTable; selectedTravelers?: Traveler[] },
    { dispatch }
  ) => {
    // --- STEP 1: TRANFORM DATA FOR WALKING TABLE UPDATE --- //
    const { id, travelers, ...walkingRouteData } =
      transformToSnakeCase(walking);

    // --- STEP 2: UPDATE AND RETURN WALKING TABLE DATA FROM SUPABASE --- //
    const { data, error } = await supabase
      .from("walking_routes")
      .update(walkingRouteData)
      .eq("id", id)
      .select();

    // IF ERROR
    if (error) throw new Error(error.message);

    // --- STEP 3: FETCH EXISTING TRAVELERS --- //
    const { data: existingTravelers, error: fetchTravelerError } =
      await supabase
        .from("walking_travelers")
        .select("traveler_id")
        .eq("walking_id", id);

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
            deleteWalkingTraveler({ travelerId, walkingId: id })
          ).unwrap();
        })
      );
    }

    // CONVERT FOR STATE UPDATE
    const newWalking = {
      ...data[0],
      id: data[0].id.toString(),
    } as WalkingRoute;

    const convertedDataDates = convertFormDatesToString(newWalking);

    const sanitizedWalking = replaceNullWithUndefined(convertedDataDates);
    const convertedReturnData = transformToCamelCase(sanitizedWalking);

    // --- STEP 6: RETURN CONVERTED WALKING DATA --- //
    return convertedReturnData;
  }
);

export const deleteWalkingTable = createAsyncThunk(
  "walking/deleteWalkingRoute",
  async (walkingId: string) => {
    // --- STEP 1: DELETE WALKING TRAVELERS ASSOCIATED WITH THIS WALKING ID --- //
    const { error: travelerError } = await supabase
      .from("walking_travelers")
      .delete()
      .eq("walking_id", walkingId);

    if (travelerError) {
      throw new Error(`Error deleting travelers: ${travelerError.message}`);
    }

    // --- STEP 2: DETELE WALKING TABLE BASED ON WALKING ID --- //
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

// --- WALKING TRAVELERS --- //
export const addWalkingTravelersTable = createAsyncThunk(
  "walking/addWalkingTravelers",
  async ({
    travelers,
    walkingId,
  }: {
    travelers: Traveler[];
    walkingId: string;
  }) => {
    try {
      // --- STEP 1: FETCH TRAVELERS BY WALKING ID --- //

      const { data: existingTravelers, error: fetchError } = await supabase
        .from("walking_travelers")
        .select("traveler_id")
        .eq("walking_id", walkingId);

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
        return { travelers: [], walkingId }; // Return early to prevent unnecessary insert
      }

      // --- STEP 2: FORMAT TRAVELER OBJECTS FOR WALKING TRAVELERS TABLE --- //
      const travelerToAdd = newTravelers.map((traveler) => {
        return {
          walking_id: walkingId,
          traveler_id: traveler.value,
          traveler_full_name: traveler.label,
        };
      });

      // --- STEP 3: ADD TRAVELERS TO WALKING TRAVELERS TABLE  --- //
      const { data, error } = await supabase
        .from("walking_travelers")
        .insert(travelerToAdd)
        .select();

      // IF ERROR
      if (error) console.log("ERROR:", error);

      console.log("Sucess:", data);

      // --- STEP 5: RETURN TRAVELERS & WALKING ID TO STATE --- ///
      return { travelers, walkingId };
    } catch (error) {
      console.error("Error adding walking travelers:", error);
      throw error;
    }
  }
);

export const deleteWalkingTraveler = createAsyncThunk(
  "walking/deleteWalkingTraveler",
  async ({
    travelerId,
    walkingId,
  }: {
    travelerId: number | string;
    walkingId: string;
  }) => {
    try {
      // --- STEP 1: DETELE WALKING TRAVELER BASED ON TRAVELER ID --- //
      const { error } = await supabase
        .from("walking_travelers")
        .delete()
        .eq("traveler_id", travelerId)
        .eq("walking_id", walkingId);

      // IF ERROR
      if (error) {
        throw new Error(error.message);
      }

      // --- STEP 2: RETURN TO STATE (so state can delete traveler) --- //
      return { travelerId, walkingId };
    } catch (error) {
      console.error("Error deleting walking traveler:", error);
      throw error;
    }
  }
);
