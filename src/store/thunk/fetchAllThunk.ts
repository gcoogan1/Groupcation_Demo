import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "..";
import { fetchFlightByGroupcationId } from "../../modules/activities/flights/thunk/flightThunk";
import { fetchStayByGroupcationId } from "../../modules/activities/stay/thunk/stayThunk";
import { fetchTrainByGroupcationId } from "../../modules/activities/train/thunk/trainThunk";
import { fetchGroupcationTable } from "./groupcationThunk";
import { fetchUsersTable } from "./usersThunk";
import { fetchBusByGroupcationId } from "../../modules/activities/bus/thunk/busThunk";
import { fetchBoatByGroupcationId } from "../../modules/activities/boat/thunk/boatThunk";
import { fetchRentalByGroupcationId } from "../../modules/activities/rental/thunk/rentalThunk";
import { fetchEventByGroupcationId } from "../../modules/activities/event/thunk/eventThunk";
import { fetchRestaurantByGroupcationId } from "../../modules/activities/restaurant/thunk/restaurantThunks";


export const fetchAllGroupcationData = createAsyncThunk<
  void,
  number,
  { dispatch: AppDispatch }
>("groupcation/fetchAllGroupcationData", async (groupcationId, { dispatch }) => {
  await Promise.all([
    dispatch(fetchGroupcationTable(groupcationId)),
    dispatch(fetchTrainByGroupcationId(groupcationId)),
    dispatch(fetchFlightByGroupcationId(groupcationId)),
    dispatch(fetchBusByGroupcationId(groupcationId)),
    dispatch(fetchBoatByGroupcationId(groupcationId)),
    dispatch(fetchStayByGroupcationId(groupcationId)),
    dispatch(fetchRentalByGroupcationId(groupcationId)),
    dispatch(fetchEventByGroupcationId(groupcationId)),
    dispatch(fetchRestaurantByGroupcationId(groupcationId)),
    dispatch(fetchUsersTable()),
  ]);
});
