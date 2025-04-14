import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { fetchFlightByGroupcationId } from "../../modules/activities/flights/thunk/flightThunk";
import { fetchStayByGroupcationId } from "../../modules/activities/stay/thunk/stayThunk";
import { fetchTrainByGroupcationId } from "../../modules/activities/train/thunk/trainThunk";
import { fetchGroupcationTable } from "./groupcationThunk";
import { fetchUsersTable } from "./usersThunk";


export const fetchAllGroupcationData = createAsyncThunk<
  void,
  number,
  { dispatch: AppDispatch }
>("groupcation/fetchAllGroupcationData", async (groupcationId, { dispatch }) => {
  await Promise.all([
    dispatch(fetchGroupcationTable(groupcationId)),
    dispatch(fetchTrainByGroupcationId(groupcationId)),
    dispatch(fetchFlightByGroupcationId(groupcationId)),
    dispatch(fetchStayByGroupcationId(groupcationId)),
    dispatch(fetchUsersTable()),
  ]);
});
