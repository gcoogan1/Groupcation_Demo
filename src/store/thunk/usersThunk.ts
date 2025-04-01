import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import { convertFormDatesToString } from "../../utils/dateFunctions/dateFunctions";
import { transformToCamelCase } from "../../utils/conversionFunctions/conversionFunctions";
import { avatarTheme } from "../../styles/theme";

type AvatarThemeKeys = keyof typeof avatarTheme;

interface User {
  id: number;
  createdAt: string;
  firstName: string;
  lastName: string;
  avatarColor:  AvatarThemeKeys
}

// GET ALL USERS
export const fetchUsersTable = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const returnData = data.map((user) => {
      const convertedDataDates = convertFormDatesToString(user);
      return transformToCamelCase(convertedDataDates);
    });

    return returnData as User[];
  }
);

// GET USER BY ID
export const fetchUserTable = createAsyncThunk(
  "user/fetchUser",
  async (userId: number) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId);
    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const returnData = data.map((user) => {
      const convertedDataDates = convertFormDatesToString(user);
      return transformToCamelCase(convertedDataDates);
    });

    return returnData as User[];
  }
);
