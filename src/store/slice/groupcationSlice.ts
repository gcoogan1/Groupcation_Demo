import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGroupcationTable } from "../thunk/groupcationThunk";


interface Groupcation {
  id: number;
  createdAt: string;
  createdBy: number;
  groupcationTitle: string;
  startDate: string;
  endDate: string;
  destinations: string[];
}

interface GroupcationState {
  groupcations: Groupcation[];
}

const initialState: GroupcationState = {
  groupcations: [],
};


const groupcationSlice = createSlice({
  name: "groupcation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchGroupcationTable.fulfilled,
        (state, action: PayloadAction<Groupcation[]>) => {
          action.payload.forEach((newGroupcation) => {
            const index = state.groupcations.findIndex(
              (groupcation) => groupcation.id === newGroupcation.id
            );
            if (index !== -1) {
              state.groupcations[index] = newGroupcation;
            } else {
              state.groupcations.push(newGroupcation);
            }
          });
        }
      )
  },
});

export default groupcationSlice.reducer;
