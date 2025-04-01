import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import { convertFormDatesToString } from "../../utils/dateFunctions/dateFunctions";
import { transformToCamelCase } from "../../utils/conversionFunctions/conversionFunctions";

interface Groupcation {
  id: number;
  createdAt: string;
  createdBy: number;
  groupcationTitle: string;
  startDate: string;
  endDate: string;
  destinations: string[];
}

export const fetchGroupcationTable = createAsyncThunk(
  "groupcation/fetchGroupcation",
  async (groupcationId: number) => {
    const { data, error } = await supabase
      .from("groupcations")
      .select("*")
      .eq("id", groupcationId);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const returnData = data.map((groupcation) => {
      const convertedDataDates = convertFormDatesToString(groupcation);
      return transformToCamelCase(convertedDataDates);
    });

    return returnData as Groupcation[];
  }
);
