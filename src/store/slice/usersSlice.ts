import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { avatarTheme } from "@styles/theme";
import { fetchUsersTable, fetchUserTable } from "../thunk/usersThunk";


type AvatarThemeKeys = keyof typeof avatarTheme;

interface User {
  id: number;
  createdAt: string;
  firstName: string;
  lastName: string;
  avatarColor:  AvatarThemeKeys
}

interface GroupcationState {
  users: User[];
}

const initialState: GroupcationState = {
  users: [],
};


const groupcationSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchUsersTable.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    })
    .addCase(
      fetchUserTable.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        action.payload.forEach((newUser) => {
          const index = state.users.findIndex(
            (user) => user.id === newUser.id
          );
          if (index !== -1) {
            state.users[index] = newUser;
          } else {
            state.users.push(newUser);
          }
        });
      }
    )
    
  },
});

export default groupcationSlice.reducer;
